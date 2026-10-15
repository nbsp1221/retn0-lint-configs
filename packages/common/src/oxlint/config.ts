import type { OxlintConfig, OxlintOverride } from 'oxlint';
import type { PolicyLayer, RuleConfig } from '../types.js';
import { testFilePatterns } from '../policies/common.js';
import { jsPolicyLayers } from '../policies/js.js';
import { reactPolicyLayers } from '../policies/react.js';
import { tsPolicyLayers } from '../policies/ts.js';
import { vitestPolicyLayers } from '../policies/vitest.js';
import { toOxlintOverrides } from '../tool-rules.js';
import { mergeOxlintConfigs } from './merge-config.js';

export interface OxlintConfigOptions {
  /**
   * Enable Vitest rules and globals for test files.
   *
   * @default false
   */
  vitest?: boolean;
}

function isOxlintConfigOptions(
  config: OxlintConfigOptions | OxlintConfig,
): config is OxlintConfigOptions {
  return 'vitest' in config;
}

/** Preserve override-only calls; recognize only the current public option. */
function parseOxlintConfigArgs(args: ReadonlyArray<OxlintConfigOptions | OxlintConfig>): {
  options: OxlintConfigOptions;
  overrides: OxlintConfig[];
} {
  let options: OxlintConfigOptions = {};
  const overrides: OxlintConfig[] = [];

  for (const [index, arg] of args.entries()) {
    if (isOxlintConfigOptions(arg)) {
      if (index !== 0) {
        throw new TypeError('Oxlint config options (vitest) must be passed as the first argument.');
      }

      if (Object.keys(arg).some((key) => key !== 'vitest')) {
        throw new TypeError(
          'Oxlint config options (vitest) cannot be mixed with Oxlint config fields. Pass options as a separate first argument.',
        );
      }

      options = arg;
    } else {
      overrides.push(arg);
    }
  }

  return { options, overrides };
}

/**
 * Builds one Oxlint override for the Vitest layers.
 *
 * All Vitest layers share the test-file scope, so they are combined into a single override that
 * also enables the `vitest` plugin and Vitest globals for those files.
 */
function createVitestOverride(layers: readonly PolicyLayer[]): OxlintOverride {
  const rules: Record<string, RuleConfig> = {};

  for (const override of toOxlintOverrides(layers)) {
    Object.assign(rules, override.rules);
  }

  return {
    files: [...testFilePatterns],
    plugins: ['vitest'],
    env: {
      vitest: true,
    },
    rules,
  };
}

export function createOxlintConfig(
  options: OxlintConfigOptions,
  ...overrides: OxlintConfig[]
): OxlintConfig;
export function createOxlintConfig(...overrides: OxlintConfig[]): OxlintConfig;

export function createOxlintConfig(
  ...args: Array<OxlintConfigOptions | OxlintConfig>
): OxlintConfig {
  const { options, overrides } = parseOxlintConfigArgs(args);
  const { vitest = false } = options;

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
      ...(vitest ? [createVitestOverride(vitestPolicyLayers)] : []),
    ],
  } satisfies OxlintConfig;

  return mergeOxlintConfigs(config, ...overrides);
}
