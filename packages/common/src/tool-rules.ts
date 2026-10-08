import type { Linter } from 'eslint';
import type { OxlintOverride } from 'oxlint';
import type { PolicyLayer, RuleConfig, RulePolicies, RulePolicy, ToolName } from './types.js';

interface ResolvedRule {
  readonly id: string;
  readonly config: RuleConfig;
}

function resolveRule(policyId: string, policy: RulePolicy, tool: ToolName): ResolvedRule {
  const mapping = policy.tools?.[tool];

  return {
    id: mapping?.ruleId ?? policy.ruleId ?? policyId,
    config: mapping?.config ?? policy.config,
  };
}

function resolveRules(policies: RulePolicies, tool: ToolName): Record<string, RuleConfig> {
  const rules: Record<string, RuleConfig> = {};

  for (const [policyId, policy] of Object.entries(policies)) {
    const rule = resolveRule(policyId, policy, tool);

    rules[rule.id] = rule.config;
  }

  return rules;
}

function disableRules(policies: RulePolicies, tool: ToolName): Record<string, 'off'> {
  const rules: Record<string, 'off'> = {};

  for (const [policyId, policy] of Object.entries(policies)) {
    const rule = resolveRule(policyId, policy, tool);

    rules[rule.id] = 'off';
  }

  return rules;
}

export function toEslintConfigs(
  layers: readonly PolicyLayer[],
  namePrefix = 'retn0',
): Linter.Config[] {
  return layers.map((layer) => ({
    name: `${namePrefix}/${layer.name}`,
    files: [...layer.files],
    rules: resolveRules(layer.rules, 'eslint'),
  }));
}

export function toEslintDisableConfigs(
  layers: readonly PolicyLayer[],
  namePrefix = 'retn0/oxlint',
): Linter.Config[] {
  return layers.map((layer) => ({
    name: `${namePrefix}/${layer.name}`,
    files: [...layer.files],
    rules: disableRules(layer.rules, 'eslint'),
  }));
}

export function toOxlintOverrides(layers: readonly PolicyLayer[]): OxlintOverride[] {
  return layers.map((layer) => ({
    files: [...layer.files],
    rules: resolveRules(layer.rules, 'oxlint'),
  }));
}
