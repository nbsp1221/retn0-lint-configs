import perfectionist from 'eslint-plugin-perfectionist';
import { defineConfig } from 'eslint/config';

export const perfectionistConfigs = defineConfig([
  {
    name: 'retn0/perfectionist',
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      perfectionist,
    },
    rules: {
      /**
       * @see https://perfectionist.dev/rules/sort-exports
       */
      'perfectionist/sort-exports': [
        'warn',
        {
          type: 'alphabetical',
          order: 'asc',
          ignoreCase: false,
          partitionByComment: true,
          partitionByNewLine: true,
        },
      ],

      /**
       * @see https://perfectionist.dev/rules/sort-named-exports
       */
      'perfectionist/sort-named-exports': [
        'warn',
        {
          type: 'alphabetical',
          order: 'asc',
          ignoreCase: false,
          groups: ['type-export', 'value-export', 'unknown'],
        },
      ],
    },
  },
]);
