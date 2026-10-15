import type { OxlintConfig } from 'oxlint';
import createConfig, { createConfig as namedCreateConfig } from '@retn0/oxlint-config';
import { describe, expect, expectTypeOf, it } from 'vitest';

describe('oxlint config exports', () => {
  it('exports the default factory as the named factory', async () => {
    const module = await import('@retn0/oxlint-config');

    expect(namedCreateConfig).toBe(createConfig);
    expect(module.default).toBe(createConfig);
    expect(module.createConfig).toBe(createConfig);
    expect(module).not.toHaveProperty('configs');
    expect(module).not.toHaveProperty('recommended');
  });

  it('creates a complete root config with local overrides', () => {
    const config = createConfig({
      ignorePatterns: ['generated/**'],
      rules: {
        'no-console': 'warn',
      },
    });

    expect(config.ignorePatterns).toEqual([
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'generated/**',
    ]);
    expect(config.options).toMatchObject({ typeAware: true });
    expect(config.categories).toMatchObject({ correctness: 'error' });
    expect(config.plugins).toEqual(
      expect.arrayContaining(['oxc', 'react', 'typescript', 'unicorn']),
    );
    expect(config.rules).toMatchObject({ 'no-console': 'warn' });
  });

  it('keeps the override-only factory signature and accepts multiple overrides', () => {
    expectTypeOf(createConfig).parameters.toEqualTypeOf<OxlintConfig[]>();

    const config = createConfig(
      { ignorePatterns: ['generated/**'] },
      { rules: { 'no-console': 'warn' } },
    );

    expect(config.ignorePatterns).toContain('generated/**');
    expect(createConfig({})).toEqual(createConfig());

    expect(config.rules).toMatchObject({ 'no-console': 'warn' });
    expect(config.overrides?.at(-1)).toMatchObject({
      plugins: ['vitest'],
      env: { vitest: true },
    });
  });
});
