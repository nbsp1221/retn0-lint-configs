import type { RuleConfig, RulePolicies, RulePolicy, ToolName } from './types.js';

interface ResolvedToolRule {
  ruleId: string;
  config: RuleConfig;
}

export function createRulesForTool(
  policies: RulePolicies,
  tool: ToolName,
): Record<string, RuleConfig> {
  const rules: Record<string, RuleConfig> = {};

  for (const [policyId, policy] of Object.entries(policies)) {
    const rule = resolveRuleForTool(policyId, policy, tool);

    rules[rule.ruleId] = rule.config;
  }

  return rules;
}

export function createRuleDisablesForTool(
  policies: RulePolicies,
  tool: ToolName,
): Record<string, 'off'> {
  const rules: Record<string, 'off'> = {};

  for (const [policyId, policy] of Object.entries(policies)) {
    const rule = resolveRuleForTool(policyId, policy, tool);

    rules[rule.ruleId] = 'off';
  }

  return rules;
}

function resolveRuleForTool(
  policyId: string,
  policy: RulePolicy,
  tool: ToolName,
): ResolvedToolRule {
  const mapping = policy.tools?.[tool];

  return {
    ruleId: mapping?.ruleId ?? policy.ruleId ?? policyId,
    config: mapping?.config ?? policy.config,
  };
}
