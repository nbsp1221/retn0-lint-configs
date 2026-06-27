import js from '@eslint/js';
import { createRulesForTool, javascriptPolicies } from '@retn0/config-policy';
import { defineConfig } from 'eslint/config';

export const jsConfigs = defineConfig({
  name: 'retn0/js',
  files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  plugins: {
    js,
  },
  extends: ['js/recommended'],
  rules: {
    ...createRulesForTool(javascriptPolicies, 'eslint'),

    /**
     * @see https://eslint.org/docs/latest/rules/no-unreachable-loop
     */
    'no-unreachable-loop': 'error',
  },
});
