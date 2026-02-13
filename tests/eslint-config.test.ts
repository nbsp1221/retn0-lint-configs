import { createConfigs } from '@retn0/eslint-config';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

type ConfigItem = ReturnType<typeof createConfigs>[number];

function getConfigNames(configs: ConfigItem[]): string[] {
  return configs
    .map(config => config.name)
    .filter((name): name is string => Boolean(name));
}

describe('createConfigs', () => {
  it('includes default presets and excludes oxlint by default', () => {
    const configs = createConfigs();
    const names = getConfigNames(configs);

    expect(names).toContain('retn0/base');
    expect(names).toContain('retn0/js');
    expect(names).toContain('retn0/ts');
    expect(names).toContain('retn0/stylistic');
    expect(names).toContain('retn0/perfectionist');
    expect(names).toContain('retn0/react');
    expect(names).not.toContain('retn0/oxlint');
  });

  it('includes oxlint preset when enabled', () => {
    const configs = createConfigs({ oxlint: true });
    const names = getConfigNames(configs);

    expect(names).toContain('retn0/oxlint');
  });

  it('applies custom perfectionist internalPattern option', () => {
    const internalPattern = ['^src/.+'];
    const configs = createConfigs({
      perfectionist: { internalPattern },
    });

    const perfectionistConfig = configs.find(
      (config: ConfigItem) => config.name === 'retn0/perfectionist',
    );

    expect(perfectionistConfig).toBeDefined();
    if (!perfectionistConfig || !perfectionistConfig.rules) {
      throw new Error('Expected perfectionist config with rules');
    }
    const sortImportsRule = perfectionistConfig.rules['perfectionist/sort-imports'];
    if (!Array.isArray(sortImportsRule)) {
      throw new Error('Expected perfectionist/sort-imports to be configured');
    }
    const [, sortImportsOptions] = sortImportsRule as [unknown, { internalPattern?: string[] }];

    expect(
      sortImportsOptions.internalPattern,
    ).toEqual(internalPattern);
  });

  it('switches no-unused-vars rule to @typescript-eslint version for ts files', () => {
    const configs = createConfigs();
    const tsConfig = configs.find((config: ConfigItem) => config.name === 'retn0/ts');

    expect(tsConfig).toBeDefined();
    if (!tsConfig || !tsConfig.rules) {
      throw new Error('Expected ts config with rules');
    }
    expect(tsConfig.rules['no-unused-vars']).toEqual(['off']);
    expect(tsConfig.rules['@typescript-eslint/no-unused-vars']).toEqual([
      'warn',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ]);
  });
});

describe('eslint behavior', () => {
  it('reports eqeqeq error for javascript files', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: createConfigs({
        ts: false,
        stylistic: false,
        perfectionist: false,
        react: false,
        oxlint: false,
      }),
    });

    const [result] = await eslint.lintText(`
const left = 1;
const right = 2;

if (left == right) {
  console.log(left, right);
}
`, { filePath: 'fixture.js' });

    const eqeqeqMessage = result.messages.find(
      message => message.ruleId === 'eqeqeq',
    );

    expect(eqeqeqMessage).toBeDefined();
    if (!eqeqeqMessage) {
      throw new Error('Expected eqeqeq message to be present');
    }
    expect(eqeqeqMessage.severity).toBe(2);
  });
});
