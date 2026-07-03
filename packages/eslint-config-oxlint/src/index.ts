import type { Linter } from 'eslint';
import {
  createOxlintConfig,
  createRuleDisablesForTool,
  javascriptPolicies,
  reactPolicies,
  typescriptPolicies,
} from '@retn0/config-policy';
import oxlint from 'eslint-plugin-oxlint';
import { defineConfig } from 'eslint/config';

type OxlintCompatConfig = Parameters<typeof oxlint.buildFromOxlintConfig>[0];

const eslintRuleDisables = {
  ...createRuleDisablesForTool(javascriptPolicies, 'eslint'),
  ...createRuleDisablesForTool(reactPolicies, 'eslint'),
  ...createRuleDisablesForTool(typescriptPolicies, 'eslint'),
} satisfies Record<string, 'off'>;

const config = defineConfig([
  ...oxlint.buildFromOxlintConfig(createOxlintConfig() as OxlintCompatConfig),
  {
    name: 'retn0/oxlint',
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    rules: eslintRuleDisables,
  },
]) as Linter.Config[];

export default config;
