import {
  type PolicyLayer,
  jsPolicyLayers,
  reactPolicyLayers,
  tsPolicyLayers,
  vitestPolicyLayers,
} from '@retn0/common';
import { describe, expect, it } from 'vitest';
import { toEslintCompatRuleMappings } from '../../packages/eslint-config-oxlint/src/rule-mappings.js';

describe('compatibility rule mappings', () => {
  it('derives only the project-specific mappings from the shared policies', () => {
    expect(
      toEslintCompatRuleMappings([
        ...jsPolicyLayers,
        ...tsPolicyLayers,
        ...reactPolicyLayers,
        ...vitestPolicyLayers,
      ]),
    ).toEqual([
      ['react-hooks/exhaustive-deps', '@eslint-react/exhaustive-deps'],
      ['react/jsx-no-comment-textnodes', '@eslint-react/jsx-no-comment-textnodes'],
      ['react/no-namespace', '@eslint-react/jsx-no-namespace'],
      ['react/no-unstable-nested-components', '@eslint-react/no-nested-component-definitions'],
      ['react-hooks/rules-of-hooks', '@eslint-react/rules-of-hooks'],
    ]);
  });

  it('uses policy changes without a separate compatibility catalogue', () => {
    const layer = {
      name: 'custom',
      files: ['**/*.js'],
      rules: {
        debugger: {
          config: 'off',
          tools: {
            eslint: { ruleId: 'custom/no-debugger' },
            oxlint: { ruleId: 'no-debugger' },
          },
        },
      },
    } satisfies PolicyLayer;

    expect(toEslintCompatRuleMappings([layer])).toEqual([['no-debugger', 'custom/no-debugger']]);
    layer.rules.debugger.tools.eslint.ruleId = 'other/no-debugger';
    expect(toEslintCompatRuleMappings([layer])).toEqual([['no-debugger', 'other/no-debugger']]);
  });

  it('preserves multiple policy targets for the same upstream rule', () => {
    const layer = {
      name: 'custom',
      files: ['**/*.js'],
      rules: {
        first: {
          config: 'error',
          tools: {
            eslint: { ruleId: 'first/no-debugger' },
            oxlint: { ruleId: 'no-debugger' },
          },
        },
        second: {
          config: 'error',
          tools: {
            eslint: { ruleId: 'second/no-debugger' },
            oxlint: { ruleId: 'no-debugger' },
          },
        },
      },
    } satisfies PolicyLayer;

    expect(toEslintCompatRuleMappings([layer])).toEqual([
      ['no-debugger', 'first/no-debugger'],
      ['no-debugger', 'second/no-debugger'],
    ]);
  });
});
