import type { OxlintConfig } from 'oxlint';
import { eslintRules } from 'eslint-plugin-oxlint/rules-by-scope';
import type { LintOptions } from '../options.js';
import type { RuleConfig } from '../types.js';
import { resolveLintOptions } from '../options.js';
import { jsPolicyLayers } from '../policies/js.js';
import { reactPolicyLayers } from '../policies/react.js';
import { tsPolicyLayers } from '../policies/ts.js';
import { vitestPolicyLayers } from '../policies/vitest.js';
import { toOxlintOverrides } from '../tool-rules.js';
import { mergeOxlintConfigs } from './merge-config.js';

export function createOxlintConfig(options: LintOptions = {}, ...overrides: OxlintConfig[]) {
  const { js, ts, react, vitest } = resolveLintOptions(options);
  // Oxlint always enables ESLint core, even with an empty plugin list.
  const rules: Record<string, RuleConfig> = js ? {} : { ...eslintRules };

  if (react) {
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/react-in-jsx-scope
     */
    rules['react/react-in-jsx-scope'] = 'off';
  }

  const config = {
    categories: {
      correctness: 'error',
    },
    ignorePatterns: ['node_modules/**', 'dist/**', 'coverage/**'],
    options: {
      typeAware: ts,
    },
    plugins: [
      ...(js ? (['oxc', 'unicorn'] as const) : []),
      ...(ts ? (['typescript'] as const) : []),
      ...(react ? (['react'] as const) : []),
    ],
    rules,
    overrides: [
      ...(js ? toOxlintOverrides(jsPolicyLayers) : []),
      ...(ts ? toOxlintOverrides(tsPolicyLayers) : []),
      ...(react ? toOxlintOverrides(reactPolicyLayers) : []),
      ...(vitest
        ? toOxlintOverrides(vitestPolicyLayers, {
            plugins: ['vitest'],
            env: { vitest: true },
          })
        : []),
    ],
  } satisfies OxlintConfig;

  return mergeOxlintConfigs(config, ...overrides);
}
