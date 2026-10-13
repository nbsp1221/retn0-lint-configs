import type { Linter } from 'eslint';
import {
  createOxlintConfig,
  jsPolicyLayers,
  reactPolicyLayers,
  toEslintDisableConfigs,
  tsPolicyLayers,
} from '@retn0/common';
import oxlint from 'eslint-plugin-oxlint';
import { defineConfig } from 'eslint/config';

type OxlintCompatConfig = Parameters<typeof oxlint.buildFromOxlintConfig>[0];

const config = defineConfig([
  // Oxlint's interfaces lack the index signatures required by this plugin's config types.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  ...oxlint.buildFromOxlintConfig(createOxlintConfig() as OxlintCompatConfig),
  ...toEslintDisableConfigs(jsPolicyLayers),
  ...toEslintDisableConfigs(reactPolicyLayers),
  ...toEslintDisableConfigs(tsPolicyLayers),
]) as Linter.Config[];

export default config;
