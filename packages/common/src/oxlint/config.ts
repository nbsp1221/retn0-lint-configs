import type { OxlintConfig } from 'oxlint';
import type { RuleConfig } from '../types.js';
import { jsPolicyLayers } from '../policies/js.js';
import { reactPolicyLayers } from '../policies/react.js';
import { tsPolicyLayers } from '../policies/ts.js';
import { toOxlintOverrides } from '../tool-rules.js';
import { mergeOxlintConfigs } from './merge-config.js';

export function createOxlintConfig(...overrides: OxlintConfig[]) {
  const rules: Record<string, RuleConfig> = {
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
      ...toOxlintOverrides(jsPolicyLayers),
      ...toOxlintOverrides(tsPolicyLayers),
      ...toOxlintOverrides(reactPolicyLayers),
    ],
  } satisfies OxlintConfig;

  return mergeOxlintConfigs(config, ...overrides);
}
