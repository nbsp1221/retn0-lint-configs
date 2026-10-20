import type { PolicyLayer } from '../types.js';
import { testFilePatterns } from './common.js';

export const vitestPolicyLayers: PolicyLayer[] = [
  {
    name: 'vitest',
    files: testFilePatterns,
    rules: {
      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/expect-expect.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/expect-expect
       */
      'vitest/expect-expect': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-commented-out-tests.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-commented-out-tests
       */
      'vitest/no-commented-out-tests': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-conditional-expect.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-conditional-expect
       */
      'vitest/no-conditional-expect': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-disabled-tests.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-disabled-tests
       */
      'vitest/no-disabled-tests': {
        config: 'warn',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-focused-tests.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-focused-tests
       */
      'vitest/no-focused-tests': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-identical-title.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-identical-title
       */
      'vitest/no-identical-title': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-import-node-test.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-import-node-test
       */
      'vitest/no-import-node-test': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-interpolation-in-snapshots.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-interpolation-in-snapshots
       */
      'vitest/no-interpolation-in-snapshots': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-mocks-import.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-mocks-import
       */
      'vitest/no-mocks-import': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-standalone-expect.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-standalone-expect
       */
      'vitest/no-standalone-expect': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-unneeded-async-expect-function.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-unneeded-async-expect-function
       */
      'vitest/no-unneeded-async-expect-function': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/prefer-called-exactly-once-with.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-called-exactly-once-with
       */
      'vitest/prefer-called-exactly-once-with': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/require-local-test-context-for-concurrent-snapshots.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-local-test-context-for-concurrent-snapshots
       */
      'vitest/require-local-test-context-for-concurrent-snapshots': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/valid-describe-callback.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/valid-describe-callback
       */
      'vitest/valid-describe-callback': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/valid-expect.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/valid-expect
       */
      'vitest/valid-expect': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/valid-expect-in-promise.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/valid-expect-in-promise
       */
      'vitest/valid-expect-in-promise': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/valid-title.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/valid-title
       */
      'vitest/valid-title': {
        config: 'error',
      },

      /**
       * Disable the Oxlint correctness default to match the Vitest recommended preset.
       *
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/hoisted-apis-on-top.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/hoisted-apis-on-top
       */
      'vitest/hoisted-apis-on-top': {
        config: 'off',
      },

      /**
       * Disable the Oxlint correctness default to match the Vitest recommended preset.
       *
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-conditional-tests.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-conditional-tests
       */
      'vitest/no-conditional-tests': {
        config: 'off',
      },

      /**
       * Disable the Oxlint correctness default to match the Vitest recommended preset.
       *
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/prefer-snapshot-hint.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-snapshot-hint
       */
      'vitest/prefer-snapshot-hint': {
        config: 'off',
      },

      /**
       * Disable the Oxlint correctness default to match the Vitest recommended preset.
       *
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/require-awaited-expect-poll.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-awaited-expect-poll
       */
      'vitest/require-awaited-expect-poll': {
        config: 'off',
      },

      /**
       * Disable the Oxlint correctness default to match the Vitest recommended preset.
       *
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/require-mock-type-parameters.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-mock-type-parameters
       */
      'vitest/require-mock-type-parameters': {
        config: 'off',
      },

      /**
       * Disable the Oxlint correctness default to match the Vitest recommended preset.
       *
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/require-to-throw-message.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-to-throw-message
       */
      'vitest/require-to-throw-message': {
        config: 'off',
      },

      /**
       * Disable the Oxlint correctness default to match the Vitest recommended preset.
       *
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/warn-todo.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/warn-todo
       */
      'vitest/warn-todo': {
        config: 'off',
      },
    },
  },
];
