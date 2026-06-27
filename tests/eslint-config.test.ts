import createConfig, { createConfig as namedCreateConfig } from '@retn0/eslint-config';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

type ConfigItem = ReturnType<typeof createConfig>[number];

function getConfigNames(configs: ConfigItem[]): string[] {
  return configs.map((config) => config.name).filter((name): name is string => Boolean(name));
}

describe('createConfig', () => {
  it('includes default js and ts presets only', () => {
    const configs = createConfig();
    const names = getConfigNames(configs);

    expect(names).toContain('retn0/base/jsx');
    expect(names).toContain('retn0/js');
    expect(names).toContain('retn0/ts');
    expect(names).not.toContain('retn0/perfectionist');
    expect(names).not.toContain('retn0/react');
    expect(names).not.toContain('retn0/react-hooks');
    expect(names).not.toContain('retn0/oxlint');
    expect(names).not.toContain('retn0/base/environments/browser');
    expect(names).not.toContain('retn0/base/environments/node');
  });

  it('exports createConfig as the named factory', () => {
    expect(namedCreateConfig).toBe(createConfig);
  });

  it('adds requested environments explicitly', () => {
    const configs = createConfig({ environments: ['browser', 'node', 'vitest'] });
    const names = getConfigNames(configs);

    expect(names).toContain('retn0/base/environments/browser');
    expect(names).toContain('retn0/base/environments/node');
    expect(names).toContain('retn0/base/environments/vitest');
  });

  it('rejects unsupported environments', () => {
    expect(() =>
      createConfig({
        environments: ['invalid-runtime' as never],
      }),
    ).toThrow('Unsupported environment "invalid-runtime"');
  });

  it('keeps perfectionist for safe export sorting only', () => {
    const configs = createConfig({
      perfectionist: true,
    });

    const perfectionistConfig = configs.find(
      (config: ConfigItem) => config.name === 'retn0/perfectionist',
    );

    expect(perfectionistConfig).toBeDefined();
    if (!perfectionistConfig || !perfectionistConfig.rules) {
      throw new Error('Expected perfectionist config with rules');
    }
    expect(perfectionistConfig.files).toEqual(['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']);
    expect(perfectionistConfig.rules['perfectionist/sort-imports']).toBeUndefined();
    expect(perfectionistConfig.rules['perfectionist/sort-named-exports']).toBeDefined();
    expect(perfectionistConfig.rules['perfectionist/sort-named-imports']).toBeUndefined();
    expect(perfectionistConfig.rules['perfectionist/sort-exports']).toEqual([
      'warn',
      {
        type: 'alphabetical',
        order: 'asc',
        ignoreCase: false,
        partitionByComment: true,
        partitionByNewLine: true,
      },
    ]);
  });

  it('uses the same unused vars policy for js and ts files', () => {
    const configs = createConfig();
    const jsConfig = configs.find((config: ConfigItem) => config.name === 'retn0/js');
    const tsConfig = configs.find((config: ConfigItem) => config.name === 'retn0/ts');

    expect(jsConfig).toBeDefined();
    expect(tsConfig).toBeDefined();
    if (!jsConfig || !jsConfig.rules) {
      throw new Error('Expected js config with rules');
    }
    if (!tsConfig || !tsConfig.rules) {
      throw new Error('Expected ts config with rules');
    }
    const expectedRule = [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ];

    expect(jsConfig.rules['no-unused-vars']).toEqual(expectedRule);
    expect(jsConfig.rules['no-unreachable-loop']).toBe('error');
    expect(jsConfig.rules['sort-imports']).toEqual([
      'warn',
      {
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ]);
    expect(tsConfig.rules['@typescript-eslint/no-unused-vars']).toEqual(expectedRule);
  });

  it('adds explicit type safety and type import rules for ts files', () => {
    const configs = createConfig();
    const tsConfig = configs.find((config: ConfigItem) => config.name === 'retn0/ts');

    expect(tsConfig).toBeDefined();
    if (!tsConfig || !tsConfig.rules) {
      throw new Error('Expected ts config with rules');
    }
    expect(tsConfig.rules['@typescript-eslint/consistent-type-exports']).toEqual([
      'error',
      {
        fixMixedExportsWithInlineTypeSpecifier: false,
      },
    ]);
    expect(tsConfig.rules['@typescript-eslint/consistent-type-imports']).toEqual([
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
        disallowTypeAnnotations: true,
      },
    ]);
    expect(tsConfig.rules['@typescript-eslint/no-import-type-side-effects']).toBe('error');
    expect(tsConfig.rules['@typescript-eslint/switch-exhaustiveness-check']).toEqual([
      'error',
      {
        considerDefaultExhaustiveForUnions: false,
      },
    ]);
  });

  it('uses eslint react as the primary react rules layer', () => {
    const configs = createConfig({ react: true });
    const policyReactConfig = configs.find((config: ConfigItem) => config.name === 'retn0/react');
    const reactConfig = configs.find(
      (config: ConfigItem) => config.name === 'retn0/react > @eslint-react/recommended-typescript',
    );

    expect(policyReactConfig).toBeDefined();
    expect(reactConfig).toBeDefined();
    if (!policyReactConfig || !policyReactConfig.rules) {
      throw new Error('Expected shared react config with rules');
    }
    if (!reactConfig || !reactConfig.rules) {
      throw new Error('Expected react config with rules');
    }
    expect(policyReactConfig.rules['@eslint-react/exhaustive-deps']).toBe('error');
    expect(policyReactConfig.rules['@eslint-react/no-nested-component-definitions']).toBe('error');
    expect(reactConfig.rules['@eslint-react/rules-of-hooks']).toBe('error');
    expect(reactConfig.rules['@eslint-react/exhaustive-deps']).toBe('warn');
    expect(reactConfig.rules['@eslint-react/use-memo']).toBe('error');
  });

  it('adds only unsupported official react hooks compiler rules', () => {
    const configs = createConfig({ react: true });
    const reactHooksConfig = configs.find(
      (config: ConfigItem) => config.name === 'retn0/react-hooks',
    );

    expect(reactHooksConfig).toBeDefined();
    if (!reactHooksConfig || !reactHooksConfig.rules) {
      throw new Error('Expected react hooks config with rules');
    }
    expect(reactHooksConfig.rules['react-hooks/config']).toBe('error');
    expect(reactHooksConfig.rules['react-hooks/gating']).toBe('error');
    expect(reactHooksConfig.rules['react-hooks/incompatible-library']).toBe('warn');
    expect(reactHooksConfig.rules['react-hooks/preserve-manual-memoization']).toBe('error');
    expect(reactHooksConfig.rules['react-hooks/rules-of-hooks']).toBeUndefined();
    expect(reactHooksConfig.rules['react-hooks/exhaustive-deps']).toBeUndefined();
  });

  it('applies user overrides after the shared config', () => {
    const configs = createConfig(
      {},
      {
        name: 'test/override',
        rules: {
          eqeqeq: ['off'],
        },
      },
    );

    expect(configs.at(-1)).toEqual({
      name: 'test/override',
      rules: {
        eqeqeq: ['off'],
      },
    });
  });
});

describe('eslint behavior', () => {
  it('does not enable browser or node globals by default', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: createConfig({
        typescript: false,
        perfectionist: false,
        react: false,
      }),
    });

    const [result] = await eslint.lintText(
      `
window.location.href = String(process.pid);
`,
      { filePath: 'fixture.js' },
    );

    const undefinedGlobals = result.messages
      .filter((message) => message.ruleId === 'no-undef')
      .map((message) => message.message);

    expect(undefinedGlobals).toEqual(["'window' is not defined.", "'process' is not defined."]);
  });

  it('enables only requested runtime globals', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: createConfig({
        typescript: false,
        perfectionist: false,
        react: false,
        environments: ['browser'],
      }),
    });

    const [result] = await eslint.lintText(
      `
window.location.href = String(process.pid);
`,
      { filePath: 'fixture.js' },
    );

    const undefinedGlobals = result.messages
      .filter((message) => message.ruleId === 'no-undef')
      .map((message) => message.message);

    expect(undefinedGlobals).toEqual(["'process' is not defined."]);
  });

  it('reports eqeqeq error for javascript files', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: createConfig({
        typescript: false,
        perfectionist: false,
        react: false,
      }),
    });

    const [result] = await eslint.lintText(
      `
const left = 1;
const right = 2;

if (left == right) {
  console.log(left, right);
}
`,
      { filePath: 'fixture.js' },
    );

    const eqeqeqMessage = result.messages.find((message) => message.ruleId === 'eqeqeq');

    expect(eqeqeqMessage).toBeDefined();
    if (!eqeqeqMessage) {
      throw new Error('Expected eqeqeq message to be present');
    }
    expect(eqeqeqMessage.severity).toBe(2);
  });

  it('sorts adjacent exports without crossing blank lines or comments', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: createConfig({
        typescript: false,
        perfectionist: true,
        react: false,
      }),
      fix: true,
    });

    const [result] = await eslint.lintText(
      `
export { Zebra } from './zebra';
export { Alpha } from './alpha';

export { Gamma } from './gamma';
export { Beta } from './beta';

// public api
export { Delta } from './delta';
export { Charlie } from './charlie';
`,
      { filePath: 'fixture.js' },
    );

    expect(result.output).toBe(`
export { Alpha } from './alpha';
export { Zebra } from './zebra';

export { Beta } from './beta';
export { Gamma } from './gamma';

// public api
export { Charlie } from './charlie';
export { Delta } from './delta';
`);
  });
});
