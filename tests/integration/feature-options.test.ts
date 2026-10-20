import type { ConfigOptions } from '@retn0/oxlint-config';
import createEslintConfig from '@retn0/eslint-config';
import createCompatConfig from '@retn0/eslint-config-oxlint';
import createOxlintConfig from '@retn0/oxlint-config';
import { ESLint } from 'eslint';
import { afterEach, describe, expect, it } from 'vitest';
import { type TempProject, createTempProject } from '../helpers/temp-project.js';

let project: TempProject | undefined;

const features = ['js', 'ts', 'react', 'vitest'] as const;
const enabled = { js: true, ts: true, react: true, vitest: true };
const ruleIds = {
  js: ['no-debugger', 'eslint(no-debugger)'],
  ts: ['@typescript-eslint/no-explicit-any', 'typescript(no-explicit-any)'],
  react: ['@eslint-react/rules-of-hooks', 'react-hooks(rules-of-hooks)'],
  vitest: ['vitest/no-focused-tests', 'vitest(no-focused-tests)'],
} as const;

const source = `
import { useState } from 'react';
import { expect, it } from 'vitest';
export const value: any = 1;
debugger;
export function Component({ enabled }: { enabled: boolean }) {
  if (enabled) { useState(0); }
  return null;
}
it.only('focused', () => { expect(1).toBe(1); });
`;

describe('shared feature options', () => {
  afterEach(async () => {
    await project?.cleanup();
    project = undefined;
  });

  it('uses the same defaults without mutating caller options', () => {
    const defaults = { js: true, ts: true, react: false, vitest: false };
    const options = { react: undefined, vitest: undefined };

    expect(createEslintConfig()).toEqual(createEslintConfig(defaults));
    expect(createOxlintConfig()).toEqual(createOxlintConfig(defaults));
    expect(createCompatConfig(createOxlintConfig())).toEqual(
      createCompatConfig(createOxlintConfig(defaults)),
    );
    expect(createOxlintConfig(options)).toEqual(createOxlintConfig());
    expect(options).toEqual({ react: undefined, vitest: undefined });
    expect(createOxlintConfig().plugins).not.toContain('react');
    expect(createOxlintConfig().overrides?.some(({ plugins }) => plugins?.includes('vitest'))).toBe(
      false,
    );
  });

  it.each([undefined, ...features])(
    'selects features independently with %s disabled',
    async (disabled) => {
      project = await createTempProject('feature-options');
      await project.writeFile('package.json', JSON.stringify({ type: 'module' }));
      await project.writeFile(
        'tsconfig.json',
        JSON.stringify({
          compilerOptions: { strict: true, target: 'ESNext', module: 'NodeNext' },
          include: ['*.ts'],
        }),
      );
      await project.writeFile('fixture.test.ts', source);
      const options: ConfigOptions =
        disabled === undefined ? enabled : { ...enabled, [disabled]: false };
      await project.writeFile('.oxlintrc.json', JSON.stringify(createOxlintConfig(options)));
      const eslint = new ESLint({
        cwd: project.root,
        overrideConfigFile: true,
        overrideConfig: createEslintConfig({ ...options, stylistic: false }),
      });
      const [standalone] = await eslint.lintFiles(['fixture.test.ts']);
      const combined = new ESLint({
        cwd: project.root,
        overrideConfigFile: true,
        overrideConfig: createEslintConfig(
          { ...options, stylistic: false },
          createCompatConfig(createOxlintConfig(options)),
        ),
      });
      const [combinedResult] = await combined.lintFiles(['fixture.test.ts']);
      const oxlint = await project.runBin('oxlint', ['--format=json', 'fixture.test.ts']);
      const eslintIds = standalone.messages.map(({ ruleId }) => ruleId);
      const combinedIds = combinedResult.messages.map(({ ruleId }) => ruleId);

      expect(standalone.messages.filter(({ fatal }) => fatal)).toEqual([]);
      expect(combinedResult.messages.filter(({ fatal }) => fatal)).toEqual([]);
      expect(oxlint.stderr).toBe('');

      for (const feature of features) {
        const [eslintRule, oxlintRule] = ruleIds[feature];

        expect(eslintIds.includes(eslintRule)).toBe(feature !== disabled);
        expect(oxlint.stdout.includes(oxlintRule)).toBe(feature !== disabled);
        expect(combinedIds.includes(eslintRule)).toBe(false);
      }
    },
  );

  it('does not disable ESLint integrations that Oxlint has not enabled', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: createEslintConfig(
        { js: false, ts: false, stylistic: false, vitest: true },
        createCompatConfig(createOxlintConfig({ js: false, ts: false })),
      ),
    });
    const [result] = await eslint.lintText("it.only('focused', () => { expect(1).toBe(1); });", {
      filePath: 'fixture.test.js',
    });

    expect(result.messages.map(({ ruleId }) => ruleId)).toContain('vitest/no-focused-tests');
  });

  it('keeps all features disabled and leaves native overrides under caller control', async () => {
    project = await createTempProject('feature-options-overrides');
    const options = { js: false, ts: false, react: false, vitest: false };
    const base = createOxlintConfig(options);
    await project.writeFile('fixture.js', 'debugger;');
    await project.writeFile('.oxlintrc.json', JSON.stringify(base));
    const disabled = await project.runBin('oxlint', ['--format=json', 'fixture.js']);
    await project.writeFile(
      '.oxlintrc.json',
      JSON.stringify(createOxlintConfig(options, { rules: { 'no-debugger': 'error' } })),
    );
    const overridden = await project.runBin('oxlint', ['--format=json', 'fixture.js']);

    expect(disabled.exitCode).toBe(0);
    expect(disabled.stdout).not.toContain('eslint(no-debugger)');
    expect(overridden.stdout).toContain('eslint(no-debugger)');
    expect(base.plugins).toEqual([]);
    expect(base.options?.typeAware).toBe(false);
    expect(base.overrides).toEqual([]);
  });
});
