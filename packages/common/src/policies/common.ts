import type { RuleConfig } from '../types.js';

export const jsFilePatterns = ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'];
export const tsFilePatterns = ['**/*.{ts,mts,cts,tsx}'];
export const reactFilePatterns = ['**/*.{js,jsx,ts,tsx}'];
export const testFilePatterns = ['**/*.{test,spec}.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'];

export const noUnusedVarsRule: RuleConfig = [
  'error',
  {
    args: 'all',
    argsIgnorePattern: '^_',
    caughtErrors: 'all',
    caughtErrorsIgnorePattern: '^_',
    destructuredArrayIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    ignoreRestSiblings: true,
  },
];
