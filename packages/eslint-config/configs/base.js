import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

export const baseConfigs = defineConfig([
  {
    name: 'retn0/base',
    files: [
      '**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    name: 'retn0/base/ts',
    files: [
      '**/*.{ts,mts,cts,tsx}',
    ],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    name: 'retn0/base/react',
    files: [
      '**/*.{jsx,tsx}',
    ],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        jsxPragma: null,
      },
    },
  },
]);
