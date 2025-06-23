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
     * @see https://eslint.style/rules/default/function-call-spacing
     */
    '@stylistic/function-call-spacing': ['error'],
  },
});
