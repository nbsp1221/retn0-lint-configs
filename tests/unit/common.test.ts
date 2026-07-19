import {
  type PolicyLayer,
  type RulePolicies,
  toEslintConfigs,
  toEslintDisableConfigs,
  toOxlintOverrides,
} from '@retn0/common';
import { describe, expect, it } from 'vitest';

const policies = {
  shared: {
    config: 'error',
  },
  renamed: {
    ruleId: 'shared-name',
    config: ['warn', { shared: true }],
  },
  mapped: {
    config: 'error',
    tools: {
      eslint: {
        ruleId: 'eslint/mapped',
        config: ['error', { eslint: true }],
      },
      oxlint: {
        ruleId: 'oxlint/mapped',
        config: ['warn', { oxlint: true }],
      },
    },
  },
} satisfies RulePolicies;

const layers: readonly PolicyLayer[] = [
  {
    name: 'shared',
    files: ['**/*.js'],
    rules: policies,
  },
  {
    name: 'tests',
    files: ['**/*.test.js'],
    rules: {
      shared: {
        config: 'off',
      },
    },
  },
];

describe('lint policy layer adapters', () => {
  it('preserves layer order and file scopes for ESLint and Oxlint', () => {
    expect(toEslintConfigs(layers)).toEqual([
      {
        name: 'retn0/shared',
        files: ['**/*.js'],
        rules: {
          'shared': 'error',
          'shared-name': ['warn', { shared: true }],
          'eslint/mapped': ['error', { eslint: true }],
        },
      },
      {
        name: 'retn0/tests',
        files: ['**/*.test.js'],
        rules: {
          shared: 'off',
        },
      },
    ]);
    expect(toOxlintOverrides(layers)).toEqual([
      {
        files: ['**/*.js'],
        rules: {
          'shared': 'error',
          'shared-name': ['warn', { shared: true }],
          'oxlint/mapped': ['warn', { oxlint: true }],
        },
      },
      {
        files: ['**/*.test.js'],
        rules: {
          shared: 'off',
        },
      },
    ]);
  });

  it('creates file-scoped ESLint disables for Oxlint compatibility', () => {
    expect(toEslintDisableConfigs(layers)).toEqual([
      {
        name: 'retn0/oxlint/shared',
        files: ['**/*.js'],
        rules: {
          'shared': 'off',
          'shared-name': 'off',
          'eslint/mapped': 'off',
        },
      },
      {
        name: 'retn0/oxlint/tests',
        files: ['**/*.test.js'],
        rules: {
          shared: 'off',
        },
      },
    ]);
  });
});
