import type { RuleConfig } from '../types.js';

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
