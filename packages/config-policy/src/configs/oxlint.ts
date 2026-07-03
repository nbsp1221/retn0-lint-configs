import type { OxlintConfig } from 'oxlint';
import type { RuleConfig } from '../types.js';
import { javascriptPolicies } from '../policies/javascript.js';
import { reactPolicies } from '../policies/react.js';
import { typescriptPolicies } from '../policies/typescript.js';
import { createRulesForTool } from '../tool-rules.js';

export function createOxlintConfig() {
  const rules: Record<string, RuleConfig> = {
    ...createRulesForTool(javascriptPolicies, 'oxlint'),
    ...createRulesForTool(reactPolicies, 'oxlint'),

    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/react-in-jsx-scope
     */
    'react/react-in-jsx-scope': 'off',
  };

  return {
    categories: {
      correctness: 'error',
    },
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
}
