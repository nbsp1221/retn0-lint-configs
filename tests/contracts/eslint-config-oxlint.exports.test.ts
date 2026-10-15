import eslintConfigOxlint, { createConfig } from '@retn0/eslint-config-oxlint';
import { describe, expect, it } from 'vitest';

describe('eslint oxlint compatibility exports', () => {
  it('exports an ESLint flat config array', async () => {
    const module = await import('@retn0/eslint-config-oxlint');

    expect(module.default).toBe(eslintConfigOxlint);
    expect(Array.isArray(eslintConfigOxlint)).toBe(true);
  });

  it('exports a factory whose default options match the default export', async () => {
    const module = await import('@retn0/eslint-config-oxlint');

    expect(module.createConfig).toBe(createConfig);
    expect(createConfig()).toEqual(eslintConfigOxlint);
  });
});
