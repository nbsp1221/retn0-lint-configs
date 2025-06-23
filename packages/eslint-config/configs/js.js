import js from '@eslint/js';
import { defineConfig } from 'eslint/config';

export const jsConfigs = defineConfig({
  name: 'retn0/js',
  files: [
    '**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
  ],
  plugins: {
    js,
  },
  rules: {
    ...js.configs.recommended.rules,

    /**
     * @see https://eslint.org/docs/latest/rules/default-case-last
     */
    'default-case-last': ['error'],

    /**
     * @see https://eslint.org/docs/latest/rules/eqeqeq
     */
    'eqeqeq': ['error'],

    /**
     * @see https://eslint.org/docs/latest/rules/no-eval
     */
    'no-eval': ['error'],

    /**
     * @see https://eslint.org/docs/latest/rules/no-implicit-coercion
     */
    'no-implicit-coercion': ['error'],

    /**
     * @see https://eslint.org/docs/latest/rules/no-unused-vars
     */
    'no-unused-vars': ['warn', {
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_',
    }],

    /**
     * @see https://eslint.org/docs/latest/rules/no-var
     */
    'no-var': ['error'],
  },
});
