import type { PolicyLayer } from '../types.js';
import { testFilePatterns } from './common.js';

/**
 * Vitest rules shared by ESLint (`@vitest/eslint-plugin`) and Oxlint (native `vitest` plugin).
 *
 * Policy IDs omit the plugin prefix; both tools share the same `vitest/<rule>` rule ID.
 *
 * The enabled rules mirror `@vitest/eslint-plugin` `configs.recommended`, including its severities.
 */
export const vitestPolicyLayers: PolicyLayer[] = [
  {
    name: 'vitest',
    files: testFilePatterns,
    rules: {
      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/expect-expect.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/expect-expect
       */
      'expect-expect': {
        ruleId: 'vitest/expect-expect',
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-commented-out-tests.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-commented-out-tests
       */
      'no-commented-out-tests': {
        ruleId: 'vitest/no-commented-out-tests',
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-conditional-expect.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-conditional-expect
       */
      'no-conditional-expect': {
        ruleId: 'vitest/no-conditional-expect',
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-disabled-tests.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-disabled-tests
       */
      'no-disabled-tests': {
        ruleId: 'vitest/no-disabled-tests',
        config: 'warn',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-focused-tests.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-focused-tests
       */
      'no-focused-tests': {
        ruleId: 'vitest/no-focused-tests',
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-identical-title.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-identical-title
       */
      'no-identical-title': {
        ruleId: 'vitest/no-identical-title',
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-import-node-test.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-import-node-test
       */
      'no-import-node-test': {
        ruleId: 'vitest/no-import-node-test',
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-interpolation-in-snapshots.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-interpolation-in-snapshots
       */
      'no-interpolation-in-snapshots': {
        ruleId: 'vitest/no-interpolation-in-snapshots',
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-mocks-import.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-mocks-import
       */
      'no-mocks-import': {
        ruleId: 'vitest/no-mocks-import',
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-standalone-expect.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-standalone-expect
       */
      'no-standalone-expect': {
        ruleId: 'vitest/no-standalone-expect',
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-unneeded-async-expect-function.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-unneeded-async-expect-function
       */
      'no-unneeded-async-expect-function': {
        ruleId: 'vitest/no-unneeded-async-expect-function',
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/prefer-called-exactly-once-with.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-called-exactly-once-with
       */
      'prefer-called-exactly-once-with': {
        ruleId: 'vitest/prefer-called-exactly-once-with',
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/require-local-test-context-for-concurrent-snapshots.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-local-test-context-for-concurrent-snapshots
       */
      'require-local-test-context-for-concurrent-snapshots': {
        ruleId: 'vitest/require-local-test-context-for-concurrent-snapshots',
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/valid-describe-callback.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/valid-describe-callback
       */
      'valid-describe-callback': {
        ruleId: 'vitest/valid-describe-callback',
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/valid-expect.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/valid-expect
       */
      'valid-expect': {
        ruleId: 'vitest/valid-expect',
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/valid-expect-in-promise.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/valid-expect-in-promise
       */
      'valid-expect-in-promise': {
        ruleId: 'vitest/valid-expect-in-promise',
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/valid-title.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/valid-title
       */
      'valid-title': {
        ruleId: 'vitest/valid-title',
        config: 'error',
      },
      // Oxlint correctness also enables these non-recommended rules. Keep them off to
      // match recommended in both tools; this is not a separate user-facing option.
      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/hoisted-apis-on-top.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/hoisted-apis-on-top
       */
      'hoisted-apis-on-top': {
        ruleId: 'vitest/hoisted-apis-on-top',
        config: 'off',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-conditional-tests.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-conditional-tests
       */
      'no-conditional-tests': {
        ruleId: 'vitest/no-conditional-tests',
        config: 'off',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/prefer-snapshot-hint.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-snapshot-hint
       */
      'prefer-snapshot-hint': {
        ruleId: 'vitest/prefer-snapshot-hint',
        config: 'off',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/require-awaited-expect-poll.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-awaited-expect-poll
       */
      'require-awaited-expect-poll': {
        ruleId: 'vitest/require-awaited-expect-poll',
        config: 'off',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/require-mock-type-parameters.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-mock-type-parameters
       */
      'require-mock-type-parameters': {
        ruleId: 'vitest/require-mock-type-parameters',
        config: 'off',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/require-to-throw-message.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-to-throw-message
       */
      'require-to-throw-message': {
        ruleId: 'vitest/require-to-throw-message',
        config: 'off',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/warn-todo.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/warn-todo
       */
      'warn-todo': {
        ruleId: 'vitest/warn-todo',
        config: 'off',
      },
    },
  },
];
