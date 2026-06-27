import eslintConfigOxlint from '@retn0/eslint-config-oxlint';
import { describe, expect, it } from 'vitest';

describe('eslint oxlint compatibility exports', () => {
  it('exports an ESLint flat config array', async () => {
    const module = await import('@retn0/eslint-config-oxlint');

    expect(module.default).toBe(eslintConfigOxlint);
    expect(Array.isArray(eslintConfigOxlint)).toBe(true);
  });
});
