import oxlint from 'eslint-plugin-oxlint';
import { defineConfig } from 'eslint/config';

export const oxlintConfigs = defineConfig([
  ...oxlint.configs['flat/recommended'],
  {
    name: 'retn0/oxlint',
    files: [
      '**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    rules: {
      /**
       * @see https://eslint.org/docs/latest/rules/eqeqeq
       */
      eqeqeq: ['off'],
    },
  },
]);
