import { testFilePatterns, toEslintConfigs, vitestPolicyLayers } from '@retn0/common';
import vitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';
import globalsPackage from 'globals';

export const vitestConfigs = defineConfig([
  {
    name: 'retn0/vitest/setup',
    files: testFilePatterns,
    plugins: {
      vitest,
    },
    languageOptions: {
      globals: globalsPackage.vitest,
    },
  },
  ...toEslintConfigs(vitestPolicyLayers),
]);
