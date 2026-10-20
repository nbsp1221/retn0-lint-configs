import type { PolicyLayer } from '../types.js';
import { testFilePatterns } from './common.js';

/**
 * Vitest rules shared by ESLint (`@vitest/eslint-plugin`) and Oxlint (native `vitest` plugin).
 *
 * ESLint is the primary reference; Oxlint links cover tool-specific options and diagnostics.
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
      'vitest/expect-expect': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-commented-out-tests.md
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
       */
      'vitest/no-unneeded-async-expect-function': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/prefer-called-exactly-once-with.md
       */
      'vitest/prefer-called-exactly-once-with': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/require-local-test-context-for-concurrent-snapshots.md
       */
      'vitest/require-local-test-context-for-concurrent-snapshots': {
        config: 'error',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/valid-describe-callback.md
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

      // Oxlint correctness also enables these non-recommended rules. Keep them off to
      // match the recommended preset in both tools.

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/hoisted-apis-on-top.md
       */
      'vitest/hoisted-apis-on-top': {
        config: 'off',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-conditional-tests.md
       */
      'vitest/no-conditional-tests': {
        config: 'off',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/prefer-snapshot-hint.md
       */
      'vitest/prefer-snapshot-hint': {
        config: 'off',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/require-awaited-expect-poll.md
       */
      'vitest/require-awaited-expect-poll': {
        config: 'off',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/require-mock-type-parameters.md
       * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-mock-type-parameters
       */
      'vitest/require-mock-type-parameters': {
        config: 'off',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/require-to-throw-message.md
       */
      'vitest/require-to-throw-message': {
        config: 'off',
      },

      /**
       * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/warn-todo.md
       */
      'vitest/warn-todo': {
        config: 'off',
      },
    },
  },
];
