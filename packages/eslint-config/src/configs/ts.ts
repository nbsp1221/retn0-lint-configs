import { noUnusedVarsRule, toEslintConfigs, tsFilePatterns, tsPolicyLayers } from '@retn0/common';
import { defineConfig } from 'eslint/config';
import ts from 'typescript-eslint';

export const tsConfigs = defineConfig([
  {
    name: 'retn0/ts/recommended',
    files: tsFilePatterns,
    extends: [ts.configs.recommendedTypeChecked],
  },
  ...toEslintConfigs(tsPolicyLayers),
  {
    name: 'retn0/ts/eslint-only',
    files: tsFilePatterns,
    rules: {
      /**
       * @see https://typescript-eslint.io/rules/no-unused-vars
       */
      '@typescript-eslint/no-unused-vars': noUnusedVarsRule,
    },
  },
]);
