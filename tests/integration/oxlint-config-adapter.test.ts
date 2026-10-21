import type { OxlintConfig } from 'oxlint';
import createEslintConfig from '@retn0/eslint-config';
import createCompatConfig from '@retn0/eslint-config-oxlint';
import createOxlintConfig from '@retn0/oxlint-config';
import { ESLint } from 'eslint';
import { afterEach, describe, expect, it } from 'vitest';
import { type TempProject, createTempProject } from '../helpers/temp-project.js';

let project: TempProject | undefined;

const inheritedCategories = [
  { name: 'off', config: { extends: [{ categories: { correctness: 'off' } }] } },
  { name: '0', config: { extends: [{ categories: { correctness: 0 } }] } },
  { name: 'allow', config: { extends: [{ categories: { correctness: 'allow' } }] } },
  {
    name: 'nested off',
    config: { extends: [{ extends: [{ categories: { correctness: 'off' } }] }] },
  },
] satisfies Array<{ name: string; config: OxlintConfig }>;

const reactAliases = [
  ['react/exhaustive-deps', '@eslint-react/exhaustive-deps'],
  ['react/jsx-no-comment-textnodes', '@eslint-react/jsx-no-comment-textnodes'],
  ['react/no-namespace', '@eslint-react/jsx-no-namespace'],
  ['react/no-unstable-nested-components', '@eslint-react/no-nested-component-definitions'],
  ['react/rules-of-hooks', '@eslint-react/rules-of-hooks'],
] as const;

describe('Oxlint configuration adapter', () => {
  afterEach(async () => {
    await project?.cleanup();
    project = undefined;
  });

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

  it.each(['off', 0, 'allow'] as const)(
    'keeps ESLint checks when correctness is %s',
    async (severity) => {
      const config = { plugins: [], categories: { correctness: severity } };

      expect(await oxlintExitCode(config)).toBe(0);
      expect(await eslintRuleIds(config)).toContain('no-debugger');
    },
  );

  it.each(['off', 0, 'allow'] as const)(
    'keeps ESLint checks when an individual rule is %s',
    async (severity) => {
      const config = { rules: { 'no-debugger': severity } };

      expect(await oxlintExitCode(config)).toBe(0);
      expect(await eslintRuleIds(config)).toContain('no-debugger');
    },
  );

  it.each([
    {
      name: 'last extends entry disables the rule',
      config: {
        extends: [{ rules: { 'no-debugger': 'error' } }, { rules: { 'no-debugger': 'off' } }],
      },
      handled: false,
    },
    {
      name: 'last extends entry enables the rule',
      config: {
        extends: [{ rules: { 'no-debugger': 'off' } }, { rules: { 'no-debugger': 'error' } }],
      },
      handled: true,
    },
    {
      name: 'root rule overrides nested extends',
      config: {
        extends: [{ extends: [{ rules: { 'no-debugger': 'error' } }] }],
        rules: { 'no-debugger': 'off' },
      },
      handled: false,
    },
    {
      name: 'root category overrides nested extends',
      config: {
        extends: [{ extends: [{ categories: { correctness: 'error' } }] }],
        categories: { correctness: 'off' },
      },
      handled: false,
    },
  ] satisfies Array<{ name: string; config: OxlintConfig; handled: boolean }>)(
    'matches Oxlint when $name',
    async ({ config, handled }) => {
      expect(await oxlintExitCode(config)).toBe(handled ? 1 : 0);
      expect((await eslintRuleIds(config)).includes('no-debugger')).toBe(!handled);
    },
  );

  it.each(inheritedCategories)('confirms Oxlint inherits correctness $name', async ({ config }) => {
    expect(await oxlintExitCode(config)).toBe(0);
  });

  // eslint-plugin-oxlint 1.89.0 does not merge inherited categories.
  // Keep the desired behavior visible until the official adapter supports it.
  it.todo.each(inheritedCategories)(
    'keeps ESLint checks when inherited correctness is $name',
    async ({ config }) => {
      expect(await eslintRuleIds(config)).toContain('no-debugger');
    },
  );
});

async function oxlintExitCode(config: OxlintConfig): Promise<number> {
  project = await createTempProject('adapter-severities');
  await project.writeFile('oxlint.config.mjs', `export default ${JSON.stringify(config)};\n`);
  await project.writeFile('fixture.js', 'debugger;\n');

  const result = await project.runBin('oxlint', [
    '--config',
    'oxlint.config.mjs',
    '--deny-warnings',
    '--format=json',
    'fixture.js',
  ]);

  expect(result.stderr).toBe('');
  expect(result.stdout).toContain('"diagnostics"');

  return result.exitCode;
}

async function eslintRuleIds(config: OxlintConfig): Promise<Array<string | null>> {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: createEslintConfig({ ts: false, stylistic: false }, createCompatConfig(config)),
  });
  const [result] = await eslint.lintText('debugger;', { filePath: 'fixture.js' });

  return result.messages.map(({ ruleId }) => ruleId);
}
