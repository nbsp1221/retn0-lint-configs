import type { Linter } from 'eslint';
import type { OxlintConfig } from 'oxlint';
import {
  jsPolicyLayers,
  reactPolicyLayers,
  tsPolicyLayers,
  vitestPolicyLayers,
} from '@retn0/common';
import oxlint from 'eslint-plugin-oxlint';
import { toEslintCompatRuleMappings } from './rule-mappings.js';

const ruleMappings = toEslintCompatRuleMappings([
  ...jsPolicyLayers,
  ...tsPolicyLayers,
  ...reactPolicyLayers,
  ...vitestPolicyLayers,
]);

export function createConfig(config: OxlintConfig): Linter.Config[] {
  const input = cloneConfig(config);

  const configs = oxlint.buildFromOxlintConfig(input, { withNursery: true });

  return configs.map((entry) => {
    if (!entry.rules) {
      return entry;
    }

    const rules = { ...entry.rules };

    for (const [ruleId, alias] of ruleMappings) {
      if (rules[ruleId] === 'off') {
        rules[alias] = 'off';
      }
    }

    return { ...entry, rules };
  });
}

// The upstream adapter mutates plugin/override arrays and nested extends objects.
function cloneConfig(config: OxlintConfig): OxlintConfig {
  return {
    ...config,
    plugins: config.plugins ? [...config.plugins] : undefined,
    overrides: config.overrides ? [...config.overrides] : undefined,
    extends: config.extends?.map(cloneConfig),
  };
}

export default createConfig;
