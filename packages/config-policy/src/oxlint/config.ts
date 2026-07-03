import type { OxlintConfig } from 'oxlint';
import type { RuleConfig } from '../types.js';
import { javascriptPolicies } from '../policies/javascript.js';
import { reactPolicies } from '../policies/react.js';
import { typescriptPolicies } from '../policies/typescript.js';
import { createRulesForTool } from '../tool-rules.js';
import { mergeOxlintConfigs } from './merge-config.js';

export function createOxlintConfig(...overrides: OxlintConfig[]) {
  const rules: Record<string, RuleConfig> = {
    ...createRulesForTool(javascriptPolicies, 'oxlint'),
    ...createRulesForTool(reactPolicies, 'oxlint'),

    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/react-in-jsx-scope
     */
    'react/react-in-jsx-scope': 'off',
  };

  const config = {
    categories: {
      correctness: 'error',
    },
    ignorePatterns: ['node_modules/**', 'dist/**', 'coverage/**'],
    options: {
      typeAware: true,
    },
    plugins: ['oxc', 'react', 'typescript', 'unicorn'],
    rules,
    overrides: [
      {
        files: ['**/*.{ts,mts,cts,tsx}'],
        rules: createRulesForTool(typescriptPolicies, 'oxlint'),
      },
    ],
  } satisfies OxlintConfig;

  return mergeOxlintConfigs(config, ...overrides);
}
