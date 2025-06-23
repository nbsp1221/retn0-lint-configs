import ts from 'typescript-eslint';
import { jsConfigs } from './js.js';

export const tsConfigs = ts.config({
  name: 'retn0/ts',
  files: [
    '**/*.{ts,mts,cts,tsx}',
  ],
  extends: [
    ts.configs.recommended,
  ],
  rules: {
    /**
     * @see https://typescript-eslint.io/rules/no-unused-vars
     */
    'no-unused-vars': ['off'],
    '@typescript-eslint/no-unused-vars': jsConfigs[0].rules['no-unused-vars'],
  },
});
