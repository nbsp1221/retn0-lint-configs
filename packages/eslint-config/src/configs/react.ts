import react from '@eslint-react/eslint-plugin';
import { reactFilePatterns, reactPolicyLayers, toEslintConfigs } from '@retn0/common';
import { defineConfig } from 'eslint/config';

export const reactConfigs = defineConfig([
  {
    name: 'retn0/react/recommended',
    files: reactFilePatterns,
    extends: [react.configs['recommended-typescript']],
  },
  ...toEslintConfigs(reactPolicyLayers),
]);
