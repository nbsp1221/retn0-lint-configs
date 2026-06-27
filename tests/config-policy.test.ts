import {
  createOxlintConfig,
  createRuleDisablesForTool,
  createRulesForTool,
  javascriptPolicies,
  reactPolicies,
  typescriptPolicies,
} from '@retn0/config-policy';
import { describe, expect, it } from 'vitest';

describe('lint policy adapters', () => {
  it('builds the shared oxlint config from the central config factory', () => {
    const config = createOxlintConfig();

    expect(config.categories?.correctness).toBe('error');
    expect(config.options?.typeAware).toBe(true);
    expect(config.plugins).toEqual(['oxc', 'react', 'typescript', 'unicorn']);
    expect(config.rules?.['array-callback-return']).toEqual([
      'error',
      {
        allowImplicit: true,
      },
    ]);
    expect(config.rules?.['react/react-in-jsx-scope']).toBe('off');
    expect(config.overrides?.[0]?.rules?.['typescript/consistent-type-imports']).toEqual([
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
        disallowTypeAnnotations: true,
      },
    ]);
  });

  it('uses shared rule names and configs when tools are compatible', () => {
    expect(createRulesForTool(javascriptPolicies, 'eslint')['array-callback-return']).toEqual([
      'error',
      {
        allowImplicit: true,
      },
    ]);
    expect(createRulesForTool(javascriptPolicies, 'oxlint')['array-callback-return']).toEqual([
      'error',
      {
        allowImplicit: true,
      },
    ]);
  });

  it('uses tool-specific rule names only when the tools differ', () => {
    const eslintRules = createRulesForTool(typescriptPolicies, 'eslint');
    const oxlintRules = createRulesForTool(typescriptPolicies, 'oxlint');

    expect(eslintRules['@typescript-eslint/consistent-type-imports']).toEqual([
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
        disallowTypeAnnotations: true,
      },
    ]);
    expect(oxlintRules['typescript/consistent-type-imports']).toEqual([
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
        disallowTypeAnnotations: true,
      },
    ]);
  });

  it('emits explicitly adopted non-recommended rules for eslint and oxlint', () => {
    const eslintRules = createRulesForTool(javascriptPolicies, 'eslint');
    const oxlintRules = createRulesForTool(javascriptPolicies, 'oxlint');

    expect(eslintRules['no-array-constructor']).toBe('error');
    expect(eslintRules['no-unused-expressions']).toBe('error');
    expect(eslintRules['prefer-rest-params']).toBe('error');
    expect(eslintRules['prefer-spread']).toBe('error');
    expect(eslintRules['sort-imports']).toEqual([
      'warn',
      {
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ]);
    expect(oxlintRules['no-array-constructor']).toBe('error');
    expect(oxlintRules['no-unused-expressions']).toBe('error');
    expect(oxlintRules['prefer-rest-params']).toBe('error');
    expect(oxlintRules['prefer-spread']).toBe('error');
    expect(oxlintRules['sort-imports']).toEqual([
      'warn',
      {
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ]);
  });

  it('keeps tool-only rules out of shared policies', () => {
    const eslintRules = createRulesForTool(javascriptPolicies, 'eslint');
    const oxlintRules = createRulesForTool(javascriptPolicies, 'oxlint');

    expect(eslintRules['no-unreachable-loop']).toBeUndefined();
    expect(oxlintRules['no-unreachable-loop']).toBeUndefined();
  });

  it('maps semantically identical react rules across eslint and oxlint', () => {
    const eslintRules = createRulesForTool(reactPolicies, 'eslint');
    const oxlintRules = createRulesForTool(reactPolicies, 'oxlint');

    expect(eslintRules['@eslint-react/exhaustive-deps']).toBe('error');
    expect(oxlintRules['react/exhaustive-deps']).toBe('error');
    expect(eslintRules['@eslint-react/no-nested-component-definitions']).toBe('error');
    expect(oxlintRules['react/no-unstable-nested-components']).toBe('error');
  });

  it('builds eslint disable rules from shared oxlint-compatible policies', () => {
    expect(createRuleDisablesForTool(javascriptPolicies, 'eslint')).toMatchObject({
      'no-useless-assignment': 'off',
      'sort-imports': 'off',
    });
    expect(createRuleDisablesForTool(reactPolicies, 'eslint')).toMatchObject({
      '@eslint-react/exhaustive-deps': 'off',
      '@eslint-react/no-nested-component-definitions': 'off',
    });
    expect(createRuleDisablesForTool(typescriptPolicies, 'eslint')).toMatchObject({
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'off',
    });
  });

  it('builds oxlint rules from shared policies', () => {
    const javascriptRules = createRulesForTool(javascriptPolicies, 'oxlint');
    const typescriptRules = createRulesForTool(typescriptPolicies, 'oxlint');

    expect(javascriptRules['array-callback-return']).toEqual([
      'error',
      {
        allowImplicit: true,
      },
    ]);
    expect(typescriptRules['typescript/consistent-type-imports']).toEqual([
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
        disallowTypeAnnotations: true,
      },
    ]);
  });
});
