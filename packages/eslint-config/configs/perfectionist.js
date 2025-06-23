import perfectionist from 'eslint-plugin-perfectionist';
import { defineConfig } from 'eslint/config';

export function createPerfectionistConfigs(options = {}) {
  const {
    internalPattern = ['^~/.+', '^@/.+'],
  } = options;

  return defineConfig({
    name: 'retn0/perfectionist',
    files: [
      '**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    plugins: {
      perfectionist,
    },
    rules: {
      /**
       * @see https://perfectionist.dev/rules/sort-exports
       */
      'perfectionist/sort-exports': ['warn', {
        type: 'alphabetical',
        order: 'asc',
        ignoreCase: false,
      }],

      /**
       * @see https://perfectionist.dev/rules/sort-imports
       */
      'perfectionist/sort-imports': ['warn', {
        type: 'alphabetical',
        order: 'asc',
        ignoreCase: false,
        internalPattern,
        newlinesBetween: 'ignore',
        groups: [
          'type-builtin',
          'value-builtin',
          'type-external',
          'value-external',
          'type-internal',
          'value-internal',
          'type-parent',
          'value-parent',
          'type-sibling',
          'value-sibling',
          'type-index',
          'value-index',
          'ts-equals-import',
          'unknown',
        ],
      }],

      /**
       * @see https://perfectionist.dev/rules/sort-named-exports
       */
      'perfectionist/sort-named-exports': ['warn', {
        type: 'alphabetical',
        order: 'asc',
        ignoreCase: false,
        groups: [
          'type-export',
          'value-export',
          'unknown',
        ],
      }],

      /**
       * @see https://perfectionist.dev/rules/sort-named-imports
       */
      'perfectionist/sort-named-imports': ['warn', {
        type: 'alphabetical',
        order: 'asc',
        ignoreCase: false,
        groups: [
          'type-import',
          'value-import',
          'unknown',
        ],
      }],
    },
  });
}
