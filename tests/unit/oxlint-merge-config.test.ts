import { mergeOxlintConfigs } from '@retn0/config-policy';
import { describe, expect, it } from 'vitest';

describe('oxlint config merger', () => {
  it('does not create absent optional config fields', () => {
    expect(mergeOxlintConfigs({}, {})).toEqual({});
  });

  it('merges root config fields with Oxlint-specific semantics', () => {
    const config = mergeOxlintConfigs(
      {
        categories: {
          correctness: 'error',
        },
        env: {
          builtin: true,
        },
        globals: {
          React: 'readonly',
        },
        ignorePatterns: ['node_modules/**', 'dist/**'],
        options: {
          typeAware: true,
        },
        overrides: [
          {
            files: ['**/*.ts'],
            rules: {
              'typescript/no-explicit-any': 'error',
            },
          },
        ],
        plugins: ['oxc', 'typescript'],
        rules: {
          'eqeqeq': 'error',
          'no-console': 'error',
        },
        settings: {
          react: {
            version: 'detect',
          },
        },
      },
      {
        categories: {
          suspicious: 'warn',
        },
        env: {
          node: true,
        },
        globals: {
          process: 'readonly',
        },
        ignorePatterns: ['dist/**', 'generated/**'],
        options: {
          typeCheck: true,
        },
        overrides: [
          {
            files: ['**/*.test.ts'],
            rules: {
              'no-console': 'off',
            },
          },
        ],
        plugins: ['typescript', 'react'],
        rules: {
          'no-console': 'warn',
        },
        settings: {
          react: {
            formComponents: ['Form'],
          },
        },
      },
    );

    expect(config).toMatchObject({
      categories: {
        correctness: 'error',
        suspicious: 'warn',
      },
      env: {
        builtin: true,
        node: true,
      },
      globals: {
        React: 'readonly',
        process: 'readonly',
      },
      ignorePatterns: ['node_modules/**', 'dist/**', 'generated/**'],
      options: {
        typeAware: true,
        typeCheck: true,
      },
      plugins: ['oxc', 'typescript', 'react'],
      rules: {
        'eqeqeq': 'error',
        'no-console': 'warn',
      },
    });
    expect(config.overrides).toHaveLength(2);
    expect(config.settings).toEqual({
      react: {
        formComponents: ['Form'],
      },
    });
  });

  it('lets consumers explicitly disable JavaScript plugins with null', () => {
    const config = mergeOxlintConfigs(
      {
        jsPlugins: [
          {
            name: 'local',
            specifier: './local-plugin.js',
          },
        ],
      },
      {
        jsPlugins: null,
      },
    );

    expect(config.jsPlugins).toBeNull();
  });

  it('preserves explicitly empty array fields', () => {
    expect(
      mergeOxlintConfigs(
        {
          ignorePatterns: [],
          plugins: [],
        },
        {},
      ),
    ).toMatchObject({
      ignorePatterns: [],
      plugins: [],
    });
  });

  it('preserves explicitly empty object fields', () => {
    const config = mergeOxlintConfigs(
      {
        globals: {},
      },
      {},
    );

    expect(config).toEqual({
      globals: {},
    });
  });
});
