import eslintConfigOxlint from '@retn0/eslint-config-oxlint';
import { describe, expect, it } from 'vitest';

describe('eslint oxlint compatibility config', () => {
  it('exports an ESLint flat config array', async () => {
    const module = await import('@retn0/eslint-config-oxlint');

    expect(module.default).toBe(eslintConfigOxlint);
    expect(Array.isArray(eslintConfigOxlint)).toBe(true);
  });

  it('disables ESLint rules already handled by Oxlint', () => {
    const config = eslintConfigOxlint.find((item) => item.name === 'retn0/oxlint');

    expect(config).toBeDefined();
    if (!config || !config.rules) {
      throw new Error('Expected oxlint compatibility config with rules');
    }

    expect(config.files).toEqual(['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']);
    expect(config.rules['array-callback-return']).toBe('off');
    expect(config.rules['sort-imports']).toBe('off');
    expect(config.rules['@eslint-react/exhaustive-deps']).toBe('off');
    expect(config.rules['@typescript-eslint/consistent-type-imports']).toBe('off');
    expect(config.rules['@typescript-eslint/switch-exhaustiveness-check']).toBe('off');
  });

  it('includes generated disables from the actual Oxlint configuration', () => {
    const generatedRules: Record<string, unknown> = {};

    for (const item of eslintConfigOxlint) {
      Object.assign(generatedRules, item.rules);
    }

    expect(generatedRules['no-unused-vars']).toBe('off');
    expect(generatedRules['@typescript-eslint/no-unsafe-call']).toBe('off');
  });
});
