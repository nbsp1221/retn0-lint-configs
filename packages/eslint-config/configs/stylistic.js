import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';

export const stylisticConfigs = defineConfig({
  name: 'retn0/stylistic',
  files: [
    '**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
  ],
  plugins: {
    '@stylistic': stylistic,
  },
  rules: {
    ...stylistic.configs.customize({ semi: true }).rules,

    /**
     * @see https://eslint.style/rules/array-bracket-newline
     */
    '@stylistic/array-bracket-newline': ['error', 'consistent'],

    /**
     * @see https://eslint.style/rules/array-element-newline
     */
    '@stylistic/array-element-newline': ['error', 'consistent'],

    /**
     * @see https://eslint.style/rules/function-call-argument-newline
     */
    '@stylistic/function-call-argument-newline': ['error', 'consistent'],

    /**
     * @see https://eslint.style/rules/function-call-spacing
     */
    '@stylistic/function-call-spacing': ['error'],

    /**
     * @see https://eslint.style/rules/function-paren-newline
     */
    '@stylistic/function-paren-newline': ['error', 'consistent'],

    /**
     * @see https://eslint.style/rules/implicit-arrow-linebreak
     */
    '@stylistic/implicit-arrow-linebreak': ['error'],

    /**
     * @see https://eslint.style/rules/jsx-self-closing-comp
     */
    '@stylistic/jsx-self-closing-comp': ['error'],

    /**
     * @see https://eslint.style/rules/linebreak-style
     */
    '@stylistic/linebreak-style': ['error', 'unix'],

    /**
     * @see https://eslint.style/rules/no-confusing-arrow
     */
    '@stylistic/no-confusing-arrow': ['error'],

    /**
     * @see https://eslint.style/rules/no-extra-semi
     */
    '@stylistic/no-extra-semi': ['error'],

    /**
     * @see https://eslint.style/rules/nonblock-statement-body-position
     */
    '@stylistic/nonblock-statement-body-position': ['error', 'beside'],

    /**
     * @see https://eslint.style/rules/object-curly-newline
     */
    '@stylistic/object-curly-newline': ['error', {
      multiline: true,
      consistent: true,
    }],

    /**
     * @see https://eslint.style/rules/object-property-newline
     */
    '@stylistic/object-property-newline': ['error', {
      allowAllPropertiesOnSameLine: true,
    }],

    /**
     * @see https://eslint.style/rules/semi-style
     */
    '@stylistic/semi-style': ['error', 'last'],

    /**
     * @see https://eslint.style/rules/switch-colon-spacing
     */
    '@stylistic/switch-colon-spacing': ['error', {
      after: true,
      before: false,
    }],
  },
});
