import createConfig from '@retn0/eslint-config';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

describe('eslint config behavior', () => {
  it('rejects unsupported environments', () => {
    expect(() =>
      createConfig({
        environments: ['invalid-runtime' as never],
      }),
    ).toThrow('Unsupported environment "invalid-runtime"');
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

  it('does not enable browser or node globals by default', async () => {
    const [result] = await lintJavaScript(
      `
window.location.href = String(process.pid);
`,
      createConfig({
        typescript: false,
        perfectionist: false,
        react: false,
      }),
    );

    expect(messagesForRule(result, 'no-undef')).toEqual([
      "'window' is not defined.",
      "'process' is not defined.",
    ]);
  });

  it('enables only requested runtime globals', async () => {
    const [result] = await lintJavaScript(
      `
window.location.href = String(process.pid);
`,
      createConfig({
        typescript: false,
        perfectionist: false,
        react: false,
        environments: ['browser'],
      }),
    );

    expect(messagesForRule(result, 'no-undef')).toEqual(["'process' is not defined."]);
  });

  it('reports JavaScript correctness rules', async () => {
    const [result] = await lintJavaScript(
      `
const left = 1;
const right = 2;

if (left == right) {
  console.log(left, right);
}
`,
      createConfig({
        typescript: false,
        perfectionist: false,
        react: false,
      }),
    );

    expect(severitiesByRule(result)).toMatchObject({
      eqeqeq: 2,
    });
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

async function lintJavaScript(
  code: string,
  overrideConfig: ReturnType<typeof createConfig>,
): Promise<ESLint.LintResult[]> {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig,
  });

  return eslint.lintText(code, { filePath: 'fixture.js' });
}

function messagesForRule(result: ESLint.LintResult, ruleId: string): string[] {
  return result.messages
    .filter((message) => message.ruleId === ruleId)
    .map((message) => message.message);
}

function severitiesByRule(result: ESLint.LintResult): Record<string, number> {
  return Object.fromEntries(
    result.messages
      .filter((message) => message.ruleId)
      .map((message) => [message.ruleId as string, message.severity]),
  );
}
