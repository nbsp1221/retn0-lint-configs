import type { PolicyLayer } from '../types.js';
import { reactFilePatterns } from './common.js';

export const reactPolicyLayers: PolicyLayer[] = [
  {
    name: 'react',
    files: reactFilePatterns,
    rules: {
      /**
       * @see https://eslint-react.xyz/docs/rules/exhaustive-deps
       * @see https://oxc.rs/docs/guide/usage/linter/rules/react/exhaustive-deps
       */
      'exhaustive-deps': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@eslint-react/exhaustive-deps',
          },
          oxlint: {
            ruleId: 'react/exhaustive-deps',
          },
        },
      },

      /**
       * @see https://eslint-react.xyz/docs/rules/no-comment-textnodes
       * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-comment-textnodes
       */
      'jsx-no-comment-textnodes': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@eslint-react/jsx-no-comment-textnodes',
          },
          oxlint: {
            ruleId: 'react/jsx-no-comment-textnodes',
          },
        },
      },

      /**
       * @see https://eslint-react.xyz/docs/rules/no-namespace
       * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-namespace
       */
      'jsx-no-namespace': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@eslint-react/jsx-no-namespace',
          },
          oxlint: {
            ruleId: 'react/no-namespace',
          },
        },
      },

      /**
       * @see https://eslint-react.xyz/docs/rules/no-nested-component-definitions
       * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-unstable-nested-components
       */
      'no-nested-component-definitions': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@eslint-react/no-nested-component-definitions',
          },
          oxlint: {
            ruleId: 'react/no-unstable-nested-components',
          },
        },
      },

      /**
       * @see https://eslint-react.xyz/docs/rules/rules-of-hooks
       * @see https://oxc.rs/docs/guide/usage/linter/rules/react/rules-of-hooks
       */
      'rules-of-hooks': {
        config: 'error',
        tools: {
          eslint: {
            ruleId: '@eslint-react/rules-of-hooks',
          },
          oxlint: {
            ruleId: 'react/rules-of-hooks',
          },
        },
      },
    },
  },
];
