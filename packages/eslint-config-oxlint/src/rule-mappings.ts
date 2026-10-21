import { type PolicyLayer, resolveRule } from '@retn0/common';
import oxlint from 'eslint-plugin-oxlint';

export function toEslintCompatRuleMappings(layers: readonly PolicyLayer[]): [string, string][] {
  const mappings: [string, string][] = [];

  for (const layer of layers) {
    for (const [policyId, policy] of Object.entries(layer.rules)) {
      const eslintRule = resolveRule(policyId, policy, 'eslint');
      const oxlintRule = resolveRule(policyId, policy, 'oxlint');

      if (eslintRule.id === oxlintRule.id) {
        continue;
      }

      // Let the upstream adapter resolve its canonical ESLint IDs, without enabling categories.
      const configs = oxlint.buildFromOxlintConfig(
        { plugins: [], categories: { correctness: 'off' }, rules: { [oxlintRule.id]: 'error' } },
        { withNursery: true, typeAware: true },
      );

      for (const { rules } of configs) {
        for (const ruleId of Object.keys(rules ?? {})) {
          if (ruleId !== eslintRule.id) {
            mappings.push([ruleId, eslintRule.id]);
          }
        }
      }
    }
  }

  return mappings;
}
