import createEslintConfig from '@retn0/eslint-config';
import createCompatConfig from '@retn0/eslint-config-oxlint';
import createOxlintConfig from '@retn0/oxlint-config';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

const reactAliases = [
  ['react/exhaustive-deps', '@eslint-react/exhaustive-deps'],
  ['react/jsx-no-comment-textnodes', '@eslint-react/jsx-no-comment-textnodes'],
  ['react/no-namespace', '@eslint-react/jsx-no-namespace'],
  ['react/no-unstable-nested-components', '@eslint-react/no-nested-component-definitions'],
  ['react/rules-of-hooks', '@eslint-react/rules-of-hooks'],
] as const;

describe('Oxlint configuration adapter', () => {
  it('reads project rule overrides without mutating the supplied config', () => {
    const input = createOxlintConfig(
      { react: true, vitest: true },
      { rules: { 'no-console': 'error' } },
    );
    const before = structuredClone(input);

    Object.freeze(input.plugins);
    Object.freeze(input.overrides);
    Object.freeze(input);

    const result = createCompatConfig(input);

    expect(input).toEqual(before);
    expect(createCompatConfig(input)).toEqual(result);
    expect(result.some(({ rules }) => rules?.['no-console'] === 'off')).toBe(true);
  });

  it('preserves nested extended configurations across repeated calls', () => {
    const base = { extends: [{ rules: { 'no-debugger': 'error' as const } }] };
    const input = { extends: [base] };
    const before = structuredClone(input);

    Object.freeze(base);

    const result = createCompatConfig(input);

    expect(input).toEqual(before);
    expect(createCompatConfig(input)).toEqual(result);
    expect(result.some(({ rules }) => rules?.['no-debugger'] === 'off')).toBe(true);
  });

  it('disables explicitly enabled nursery rules', () => {
    const result = createCompatConfig({
      plugins: [],
      categories: { correctness: 'off' },
      rules: { 'no-unreachable-loop': 'error' },
    });

    expect(result.some(({ rules }) => rules?.['no-unreachable-loop'] === 'off')).toBe(true);
  });

  it.each(reactAliases)('maps %s to the configured ESLint plugin', (ruleId, alias) => {
    const result = createCompatConfig({
      plugins: ['react'],
      categories: { correctness: 'off' },
      overrides: [{ files: ['src/**/*.tsx'], rules: { [ruleId]: 'error' } }],
    });

    expect(result.filter(({ rules }) => rules?.[alias] === 'off')).toEqual([
      expect.objectContaining({ files: ['src/**/*.tsx'] }),
    ]);
  });

  it('keeps React checks outside the Oxlint override scope', async () => {
    const oxlintConfig = {
      plugins: ['react'],
      categories: { correctness: 'off' },
      overrides: [{ files: ['src/**/*.jsx'], rules: { 'react/rules-of-hooks': 'error' } }],
    } satisfies Parameters<typeof createCompatConfig>[0];
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: createEslintConfig({ react: true }, createCompatConfig(oxlintConfig)),
    });
    const inside: unknown = await eslint.calculateConfigForFile('src/component.jsx');
    const outside: unknown = await eslint.calculateConfigForFile('other/component.jsx');

    expect(inside).toMatchObject({ rules: { '@eslint-react/rules-of-hooks': [0] } });
    expect(outside).toMatchObject({ rules: { '@eslint-react/rules-of-hooks': [2] } });
  });

  it('does not disable ESLint checks when no Oxlint rules are enabled', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: createEslintConfig(
        { ts: false, stylistic: false },
        createCompatConfig({ plugins: [], categories: { correctness: 'off' } }),
      ),
    });
    const [result] = await eslint.lintText('debugger;', { filePath: 'fixture.js' });

    expect(result.messages.map(({ ruleId }) => ruleId)).toContain('no-debugger');
  });
});
