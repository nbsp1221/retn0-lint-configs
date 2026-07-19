import type { PolicyLayer } from '../types.js';
import { jsFilePatterns, noUnusedVarsRule, testFilePatterns } from './common.js';

export const jsPolicyLayers: PolicyLayer[] = [
  {
    name: 'js',
    files: jsFilePatterns,
    rules: {
      /**
       * @see https://eslint.org/docs/latest/rules/array-callback-return
       */
      'array-callback-return': {
        config: ['error', { allowImplicit: true }],
      },

      /**
       * @see https://eslint.org/docs/latest/rules/curly
       */
      'curly': {
        config: ['error', 'all'],
      },

      /**
       * @see https://eslint.org/docs/latest/rules/max-depth
       */
      'max-depth': {
        config: ['warn', { max: 8 }],
      },

      /**
       * @see https://eslint.org/docs/latest/rules/max-lines
       */
      'max-lines': {
        config: ['warn', { max: 1000, skipBlankLines: true, skipComments: true }],
      },

      /**
       * @see https://eslint.org/docs/latest/rules/max-lines-per-function
       */
      'max-lines-per-function': {
        config: [
          'warn',
          {
            max: 300,
            skipBlankLines: true,
            skipComments: true,
            IIFEs: false,
          },
        ],
      },

      /**
       * @see https://eslint.org/docs/latest/rules/default-case-last
       */
      'default-case-last': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/eqeqeq
       */
      'eqeqeq': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-array-constructor
       */
      'no-array-constructor': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-case-declarations
       */
      'no-case-declarations': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-constructor-return
       */
      'no-constructor-return': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-duplicate-imports
       */
      'no-duplicate-imports': {
        config: ['error', { allowSeparateTypeImports: true }],
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-empty
       */
      'no-empty': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-eval
       */
      'no-eval': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-fallthrough
       */
      'no-fallthrough': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-implicit-coercion
       */
      'no-implicit-coercion': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-promise-executor-return
       */
      'no-promise-executor-return': {
        config: ['error', { allowVoid: true }],
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-prototype-builtins
       */
      'no-prototype-builtins': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-regex-spaces
       */
      'no-regex-spaces': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-self-compare
       */
      'no-self-compare': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-template-curly-in-string
       */
      'no-template-curly-in-string': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-unexpected-multiline
       */
      'no-unexpected-multiline': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-unreachable-loop
       */
      'no-unreachable-loop': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-unused-expressions
       */
      'no-unused-expressions': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-unused-vars
       */
      'no-unused-vars': {
        config: noUnusedVarsRule,
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-useless-assignment
       */
      'no-useless-assignment': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/no-var
       */
      'no-var': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/prefer-const
       */
      'prefer-const': {
        config: ['error', { destructuring: 'all', ignoreReadBeforeAssign: true }],
      },

      /**
       * @see https://eslint.org/docs/latest/rules/prefer-rest-params
       */
      'prefer-rest-params': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/prefer-spread
       */
      'prefer-spread': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/preserve-caught-error
       */
      'preserve-caught-error': {
        config: 'error',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/sort-imports
       */
      'sort-imports': {
        config: [
          'warn',
          {
            ignoreDeclarationSort: true,
            ignoreMemberSort: false,
            memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          },
        ],
      },
    },
  },
  {
    name: 'js/tests',
    files: testFilePatterns,
    rules: {
      /**
       * @see https://eslint.org/docs/latest/rules/max-depth
       */
      'max-depth': {
        config: 'off',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/max-lines
       */
      'max-lines': {
        config: 'off',
      },

      /**
       * @see https://eslint.org/docs/latest/rules/max-lines-per-function
       */
      'max-lines-per-function': {
        config: 'off',
      },
    },
  },
];
