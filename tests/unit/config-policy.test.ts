import {
  type RulePolicies,
  createRuleDisablesForTool,
  createRulesForTool,
} from '@retn0/config-policy';
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

describe('lint policy rule adapters', () => {
  it('uses the policy id as the rule id by default', () => {
    expect(createRulesForTool(policies, 'eslint')).toMatchObject({
      shared: 'error',
    });
    expect(createRulesForTool(policies, 'oxlint')).toMatchObject({
      shared: 'error',
    });
  });

  it('uses a shared rule id when a policy defines one', () => {
    expect(createRulesForTool(policies, 'eslint')).toMatchObject({
      'shared-name': ['warn', { shared: true }],
    });
    expect(createRulesForTool(policies, 'oxlint')).toMatchObject({
      'shared-name': ['warn', { shared: true }],
    });
  });

  it('uses tool-specific rule ids and configs when a policy maps tools explicitly', () => {
    expect(createRulesForTool(policies, 'eslint')).toMatchObject({
      'eslint/mapped': ['error', { eslint: true }],
    });
    expect(createRulesForTool(policies, 'oxlint')).toMatchObject({
      'oxlint/mapped': ['warn', { oxlint: true }],
    });
  });

  it('builds disable rules from the same resolved rule ids', () => {
    expect(createRuleDisablesForTool(policies, 'eslint')).toEqual({
      'shared': 'off',
      'shared-name': 'off',
      'eslint/mapped': 'off',
    });
    expect(createRuleDisablesForTool(policies, 'oxlint')).toEqual({
      'shared': 'off',
      'shared-name': 'off',
      'oxlint/mapped': 'off',
    });
  });
});
