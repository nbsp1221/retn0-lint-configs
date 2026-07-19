import js from '@eslint/js';
import { jsFilePatterns, jsPolicyLayers, toEslintConfigs } from '@retn0/common';
import { defineConfig } from 'eslint/config';

export const jsConfigs = defineConfig([
  {
    name: 'retn0/js/recommended',
    files: jsFilePatterns,
    plugins: {
      js,
    },
    extends: ['js/recommended'],
  },
  ...toEslintConfigs(jsPolicyLayers),
]);
