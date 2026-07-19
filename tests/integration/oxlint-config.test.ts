import { afterEach, describe, expect, it } from 'vitest';
import { type TempProject, createTempProject } from '../helpers/temp-project.js';

let project: TempProject | undefined;

describe('oxlint config behavior', () => {
  afterEach(async () => {
    await project?.cleanup();
    project = undefined;
  });

  it('runs JavaScript, TypeScript, and React rules from a consumer oxlint.config.ts', async () => {
    project = await createTempProject('oxlint-config');
    await writeOxlintProject(project);
    await project.writeFile(
      'index.ts',
      `
const value: any = 1;
value();

const left = 1;
const right = 2;

if (left == right) {
  console.log(left, right);
}
`,
    );
    await project.writeFile(
      'component.tsx',
      `
import { useState } from 'react';

export function Component({ enabled }: { enabled: boolean }) {
  if (enabled) {
    useState(0);
  }

  return null;
}
`,
    );

    const result = await project.runBin('oxlint', ['--format=json', 'index.ts', 'component.tsx']);

    expect(result.exitCode).toBe(1);
    expect(diagnosticCodes(result.stdout)).toEqual(
      expect.arrayContaining([
        'eslint(eqeqeq)',
        'typescript(no-explicit-any)',
        'typescript(no-unsafe-call)',
        'react-hooks(rules-of-hooks)',
      ]),
    );
  });

  it('warns on extreme production size while excluding test filenames', async () => {
    project = await createTempProject('oxlint-config-maintainability');
    await writeOxlintProject(project);
    const oversizedSource = [
      'function oversized() {',
      ...Array.from({ length: 301 }, (_, index) => `  console.log(${index});`),
      '}',
      ...Array.from({ length: 700 }, (_, index) => `export const value${index} = ${index};`),
      ...Array.from({ length: 9 }, () => 'if (true) {'),
      '  console.log("nested");',
      ...Array.from({ length: 9 }, () => '}'),
    ].join('\n');
    await project.writeFile('fixture.js', oversizedSource);
    await project.writeFile('fixture.spec.js', oversizedSource);

    const result = await project.runBin('oxlint', [
      '--format=json',
      'fixture.js',
      'fixture.spec.js',
    ]);
    const diagnostics = diagnosticEntries(result.stdout);

    expect(diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'eslint(max-depth)',
          filename: 'fixture.js',
          severity: 'warning',
        }),
        expect.objectContaining({
          code: 'eslint(max-lines)',
          filename: 'fixture.js',
          severity: 'warning',
        }),
        expect.objectContaining({
          code: 'eslint(max-lines-per-function)',
          filename: 'fixture.js',
          severity: 'warning',
        }),
      ]),
    );
    expect(
      diagnostics.filter(
        (diagnostic) =>
          diagnostic.filename === 'fixture.spec.js' &&
          ['eslint(max-depth)', 'eslint(max-lines)', 'eslint(max-lines-per-function)'].includes(
            diagnostic.code,
          ),
      ),
    ).toEqual([]);
  });

  it('does not lint dependency files when running from the project root', async () => {
    project = await createTempProject('oxlint-config-ignores');
    await writeOxlintProject(project);
    await project.writeFile('index.ts', 'const value = 1;\n');

    const result = await project.runBin('oxlint', ['--debug=files', '.']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('index.ts');
    expect(result.stdout).not.toContain('node_modules/');
  });
});

async function writeOxlintProject(project: TempProject): Promise<void> {
  await project.writeFile('package.json', JSON.stringify({ type: 'module' }, undefined, 2));
  await project.writeFile(
    'tsconfig.json',
    JSON.stringify(
      {
        compilerOptions: {
          jsx: 'react-jsx',
          module: 'nodenext',
          moduleResolution: 'nodenext',
          strict: true,
          target: 'ES2024',
        },
        include: ['**/*'],
      },
      undefined,
      2,
    ),
  );
  await project.writeFile(
    'oxlint.config.ts',
    `
import retn0 from '@retn0/oxlint-config';

export default retn0();
`,
  );
}

function diagnosticCodes(stdout: string): string[] {
  const output = JSON.parse(stdout) as { diagnostics: Array<{ code: string }> };
  return output.diagnostics.map((diagnostic) => diagnostic.code).sort();
}

function diagnosticEntries(
  stdout: string,
): Array<{ code: string; filename: string; severity: string }> {
  const output = JSON.parse(stdout) as {
    diagnostics: Array<{ code: string; filename: string; severity: string }>;
  };
  return output.diagnostics;
}
