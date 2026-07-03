import type { ESLint } from 'eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

const reactHooksPlugin = {
  meta: reactHooks.meta,
  rules: reactHooks.rules,
} satisfies ESLint.Plugin;

export const reactHooksConfigs = defineConfig({
  name: 'retn0/react-hooks',
  files: ['**/*.{js,jsx,ts,tsx}'],
  plugins: {
    'react-hooks': reactHooksPlugin,
  },
  rules: {
    /**
     * @see https://react.dev/reference/eslint-plugin-react-hooks/lints/config
     */
    'react-hooks/config': 'error',

    /**
     * @see https://react.dev/reference/eslint-plugin-react-hooks/lints/gating
     */
    'react-hooks/gating': 'error',

    /**
     * @see https://react.dev/reference/eslint-plugin-react-hooks/lints/incompatible-library
     */
    'react-hooks/incompatible-library': 'warn',

    /**
     * @see https://react.dev/reference/eslint-plugin-react-hooks/lints/preserve-manual-memoization
     */
    'react-hooks/preserve-manual-memoization': 'error',
  },
});
