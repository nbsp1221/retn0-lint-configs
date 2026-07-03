import type { Linter } from 'eslint';

export type ToolName = 'eslint' | 'oxlint';

export type RuleConfig = Linter.RuleEntry;

export interface ToolRuleMapping {
  readonly ruleId?: string;
  readonly config?: RuleConfig;
}

export interface RulePolicy {
  readonly ruleId?: string;
  readonly config: RuleConfig;
  readonly tools?: Readonly<Record<ToolName, ToolRuleMapping>>;
}

export interface RulePolicies {
  readonly [policyId: string]: RulePolicy;
}
