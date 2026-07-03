import createConfig, { createConfig as namedCreateConfig } from '@retn0/oxlint-config';
import { describe, expect, it } from 'vitest';

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
});
