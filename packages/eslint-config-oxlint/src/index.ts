import type { Linter } from 'eslint';
import {
  createOxlintConfig,
  jsPolicyLayers,
  reactPolicyLayers,
  toEslintDisableConfigs,
  tsPolicyLayers,
  vitestPolicyLayers,
} from '@retn0/common';
import oxlint from 'eslint-plugin-oxlint';
import { defineConfig } from 'eslint/config';

type OxlintCompatConfig = Parameters<typeof oxlint.buildFromOxlintConfig>[0];

/**
 * Match the options passed to `@retn0/oxlint-config`.
 */
export interface ConfigOptions {
  /**
   * Disable ESLint Vitest rules that Oxlint handles for test files.
   *
   * @default false
   */
  vitest?: boolean;
}

export function createConfig(options: ConfigOptions = {}): Linter.Config[] {
  const { vitest = false } = options;

  return defineConfig([
    // Oxlint's interfaces lack the index signatures required by this plugin's config types.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    ...oxlint.buildFromOxlintConfig(createOxlintConfig({ vitest }) as OxlintCompatConfig),
    ...toEslintDisableConfigs(jsPolicyLayers),
    ...toEslintDisableConfigs(reactPolicyLayers),
    ...toEslintDisableConfigs(tsPolicyLayers),
    ...(vitest ? toEslintDisableConfigs(vitestPolicyLayers) : []),
  ]);
}

const config: Linter.Config[] = createConfig();

export default config;
