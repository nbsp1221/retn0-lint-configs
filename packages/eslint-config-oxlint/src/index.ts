import type { Linter } from 'eslint';
import type { OxlintConfig } from 'oxlint';
import oxlint from 'eslint-plugin-oxlint';

type OxlintCompatConfig = Parameters<typeof oxlint.buildFromOxlintConfig>[0];

const reactRuleAliases: Record<string, string> = {
  'react-hooks/exhaustive-deps': '@eslint-react/exhaustive-deps',
  'react-hooks/rules-of-hooks': '@eslint-react/rules-of-hooks',
  'react/jsx-no-comment-textnodes': '@eslint-react/jsx-no-comment-textnodes',
  'react/no-namespace': '@eslint-react/jsx-no-namespace',
  'react/no-unstable-nested-components': '@eslint-react/no-nested-component-definitions',
};

export function createConfig(config: OxlintConfig): Linter.Config[] {
  const input = cloneConfig(config);

  // Oxlint's interfaces lack the index signatures required by this plugin's config types.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const compatInput = input as OxlintCompatConfig;
  const configs = oxlint.buildFromOxlintConfig(compatInput, { withNursery: true });

  return configs.map((entry) => {
    if (!entry.rules) {
      return entry;
    }

    const rules = { ...entry.rules };

    for (const [ruleId, alias] of Object.entries(reactRuleAliases)) {
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
