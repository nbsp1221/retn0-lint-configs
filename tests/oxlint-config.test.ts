import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { createOxlintConfig } from '@retn0/config-policy';
import config from '@retn0/oxlint-config';
import { describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

describe('oxlint config exports', () => {
  it('exports the config as the default export', async () => {
    const module = await import('@retn0/oxlint-config');

    expect(module.default).toBe(config);
    expect(module).not.toHaveProperty('configs');
    expect(module).not.toHaveProperty('createConfig');
    expect(module).not.toHaveProperty('recommended');
  });

  it('enables type-aware linting in the shared preset', () => {
    expect(config.options?.typeAware).toBe(true);
  });

  it('uses the central oxlint config factory as its source of truth', () => {
    expect(config).toEqual(createOxlintConfig());
  });

  it('keeps oxlint-only rules in the oxlint config package', () => {
    expect(config.rules?.['react/react-in-jsx-scope']).toBe('off');
  });

  it('uses shared lint policy for import specifier sorting', () => {
    expect(config.rules?.['sort-imports']).toEqual([
      'warn',
      {
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ]);
  });

  it('builds the shared preset from shared lint policies', () => {
    expect(config.rules?.['array-callback-return']).toEqual([
      'error',
      {
        allowImplicit: true,
      },
    ]);
    expect(config.overrides?.[0]?.rules?.['typescript/consistent-type-imports']).toEqual([
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
        disallowTypeAnnotations: true,
      },
    ]);
  });

  it('applies type-aware rules when extended from an oxlint root config', async () => {
    const scratchRoot = join(repoRoot, '.tmp');
    await mkdir(scratchRoot, { recursive: true });
    const fixtureRoot = await mkdtemp(join(scratchRoot, 'oxlint-config-'));

    try {
      await writeFile(
        join(fixtureRoot, 'package.json'),
        JSON.stringify({ type: 'module' }, undefined, 2),
      );
      await writeFile(
        join(fixtureRoot, 'tsconfig.json'),
        JSON.stringify(
          {
            compilerOptions: {
              module: 'nodenext',
              moduleResolution: 'nodenext',
              strict: true,
              target: 'es2024',
            },
            include: ['index.ts'],
          },
          undefined,
          2,
        ),
      );
      await writeFile(
        join(fixtureRoot, 'oxlint.config.ts'),
        `
import config from '@retn0/oxlint-config';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [config],
});
`,
      );
      await writeFile(
        join(fixtureRoot, 'index.ts'),
        `
const value: any = 1;
value();
`,
      );

      let stdout = '';

      try {
        await execFileAsync(join(repoRoot, 'node_modules/.bin/oxlint'), ['index.ts'], {
          cwd: fixtureRoot,
        });
      } catch (error: unknown) {
        if (hasStringStdout(error)) {
          stdout = error.stdout;
        }
      }

      expect(stdout).toContain('typescript(no-unsafe-call)');
    } finally {
      await rm(fixtureRoot, { recursive: true, force: true });
    }
  });
});

function hasStringStdout(error: unknown): error is { stdout: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'stdout' in error &&
    typeof error.stdout === 'string'
  );
}
