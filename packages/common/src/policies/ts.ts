import type { PolicyLayer } from '../types.js';
import { tsFilePatterns } from './common.js';

export const tsPolicyLayers: PolicyLayer[] = [
  {
    name: 'ts',
    files: tsFilePatterns,
    rules: {
      /**
       * @see https://typescript-eslint.io/rules/ban-ts-comment
       */
      'ban-ts-comment': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/ban-ts-comment',
          },
          oxlint: {
            ruleId: 'typescript/ban-ts-comment',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/consistent-type-exports
       */
      'consistent-type-exports': {
        config: ['error', { fixMixedExportsWithInlineTypeSpecifier: false }],
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/consistent-type-exports',
          },
          oxlint: {
            ruleId: 'typescript/consistent-type-exports',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/consistent-type-imports
       */
      'consistent-type-imports': {
        config: [
          'error',
          {
            prefer: 'type-imports',
            fixStyle: 'separate-type-imports',
            disallowTypeAnnotations: true,
          },
        ],
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/consistent-type-imports',
          },
          oxlint: {
            ruleId: 'typescript/consistent-type-imports',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/no-empty-object-type
       */
      'no-empty-object-type': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/no-empty-object-type',
          },
          oxlint: {
            ruleId: 'typescript/no-empty-object-type',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/no-explicit-any
       */
      'no-explicit-any': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/no-explicit-any',
          },
          oxlint: {
            ruleId: 'typescript/no-explicit-any',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/no-import-type-side-effects
       */
      'no-import-type-side-effects': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/no-import-type-side-effects',
          },
          oxlint: {
            ruleId: 'typescript/no-import-type-side-effects',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/no-misused-promises
       */
      'no-misused-promises': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/no-misused-promises',
          },
          oxlint: {
            ruleId: 'typescript/no-misused-promises',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/no-namespace
       */
      'no-namespace': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/no-namespace',
          },
          oxlint: {
            ruleId: 'typescript/no-namespace',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/no-require-imports
       */
      'no-require-imports': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/no-require-imports',
          },
          oxlint: {
            ruleId: 'typescript/no-require-imports',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/no-unnecessary-type-assertion
       */
      'no-unnecessary-type-assertion': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/no-unnecessary-type-assertion',
          },
          oxlint: {
            ruleId: 'typescript/no-unnecessary-type-assertion',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/no-unnecessary-type-constraint
       */
      'no-unnecessary-type-constraint': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/no-unnecessary-type-constraint',
          },
          oxlint: {
            ruleId: 'typescript/no-unnecessary-type-constraint',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/no-unsafe-argument
       */
      'no-unsafe-argument': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/no-unsafe-argument',
          },
          oxlint: {
            ruleId: 'typescript/no-unsafe-argument',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/no-unsafe-assignment
       */
      'no-unsafe-assignment': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/no-unsafe-assignment',
          },
          oxlint: {
            ruleId: 'typescript/no-unsafe-assignment',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/no-unsafe-call
       */
      'no-unsafe-call': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/no-unsafe-call',
          },
          oxlint: {
            ruleId: 'typescript/no-unsafe-call',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/no-unsafe-enum-comparison
       */
      'no-unsafe-enum-comparison': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/no-unsafe-enum-comparison',
          },
          oxlint: {
            ruleId: 'typescript/no-unsafe-enum-comparison',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/no-unsafe-function-type
       */
      'no-unsafe-function-type': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/no-unsafe-function-type',
          },
          oxlint: {
            ruleId: 'typescript/no-unsafe-function-type',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/no-unsafe-member-access
       */
      'no-unsafe-member-access': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/no-unsafe-member-access',
          },
          oxlint: {
            ruleId: 'typescript/no-unsafe-member-access',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/no-unsafe-return
       */
      'no-unsafe-return': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/no-unsafe-return',
          },
          oxlint: {
            ruleId: 'typescript/no-unsafe-return',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/only-throw-error
       */
      'only-throw-error': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/only-throw-error',
          },
          oxlint: {
            ruleId: 'typescript/only-throw-error',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/prefer-promise-reject-errors
       */
      'prefer-promise-reject-errors': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/prefer-promise-reject-errors',
          },
          oxlint: {
            ruleId: 'typescript/prefer-promise-reject-errors',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/require-await
       */
      'require-await': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/require-await',
          },
          oxlint: {
            ruleId: 'typescript/require-await',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/restrict-plus-operands
       */
      'restrict-plus-operands': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/restrict-plus-operands',
          },
          oxlint: {
            ruleId: 'typescript/restrict-plus-operands',
          },
        },
      },

      /**
       * @see https://typescript-eslint.io/rules/switch-exhaustiveness-check
       */
      'switch-exhaustiveness-check': {
        config: ['error', { considerDefaultExhaustiveForUnions: false }],
        tools: {
          eslint: {
            ruleId: '@typescript-eslint/switch-exhaustiveness-check',
          },
          oxlint: {
            ruleId: 'typescript/switch-exhaustiveness-check',
          },
        },
      },
    },
  },
];
