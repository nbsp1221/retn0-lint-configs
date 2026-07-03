import { createRulesForTool, noUnusedVarsRule, typescriptPolicies } from '@retn0/config-policy';
import { defineConfig } from 'eslint/config';
import ts from 'typescript-eslint';

export const tsConfigs = defineConfig({
  name: 'retn0/ts',
  files: ['**/*.{ts,mts,cts,tsx}'],
  extends: [ts.configs.recommendedTypeChecked],
  rules: {
    ...createRulesForTool(typescriptPolicies, 'eslint'),

    /**
     * @see https://typescript-eslint.io/rules/no-unused-vars
     */
    '@typescript-eslint/no-unused-vars': noUnusedVarsRule,
  },
});
