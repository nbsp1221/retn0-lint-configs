import type { LintOptions } from '@retn0/common';
import type { Linter } from 'eslint';
import {
  createOxlintConfig,
  jsPolicyLayers,
  reactPolicyLayers,
  resolveLintOptions,
  toEslintDisableConfigs,
  tsPolicyLayers,
} from '@retn0/common';
import oxlint from 'eslint-plugin-oxlint';
import { defineConfig } from 'eslint/config';

type OxlintCompatConfig = Parameters<typeof oxlint.buildFromOxlintConfig>[0];

export type ConfigOptions = LintOptions;

export function createConfig(options: ConfigOptions = {}): Linter.Config[] {
  const { js, ts, react } = resolveLintOptions(options);

  return defineConfig([
    // Oxlint's interfaces lack the index signatures required by this plugin's config types.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    ...oxlint.buildFromOxlintConfig(createOxlintConfig(options) as OxlintCompatConfig),
    ...(js ? toEslintDisableConfigs(jsPolicyLayers) : []),
    ...(react ? toEslintDisableConfigs(reactPolicyLayers) : []),
    ...(ts ? toEslintDisableConfigs(tsPolicyLayers) : []),
  ]);
}

export default createConfig;
