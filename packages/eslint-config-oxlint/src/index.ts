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
  ...oxlint.buildFromOxlintConfig(createOxlintConfig() as OxlintCompatConfig),
  ...toEslintDisableConfigs(jsPolicyLayers),
  ...toEslintDisableConfigs(reactPolicyLayers),
  ...toEslintDisableConfigs(tsPolicyLayers),
]) as Linter.Config[];

export default config;
