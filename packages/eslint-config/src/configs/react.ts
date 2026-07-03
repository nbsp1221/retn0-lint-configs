import react from '@eslint-react/eslint-plugin';
import { createRulesForTool, reactPolicies } from '@retn0/config-policy';
import { defineConfig } from 'eslint/config';

export const reactConfigs = defineConfig({
  name: 'retn0/react',
  files: ['**/*.{js,jsx,ts,tsx}'],
  extends: [react.configs['recommended-typescript']],
  rules: createRulesForTool(reactPolicies, 'eslint'),
});
