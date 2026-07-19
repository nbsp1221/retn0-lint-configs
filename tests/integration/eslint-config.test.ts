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
    const [result] = await lintJs(
      `
window.location.href = String(process.pid);
`,
      createConfig({
        ts: false,
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
    const [result] = await lintJs(
      `
window.location.href = String(process.pid);
`,
      createConfig({
        ts: false,
        perfectionist: false,
        react: false,
        environments: ['browser'],
      }),
    );

    expect(messagesForRule(result, 'no-undef')).toEqual(["'process' is not defined."]);
  });

  it('reports JavaScript correctness rules', async () => {
    const [result] = await lintJs(
      `
const left = 1;
const right = 2;

if (left == right) {
  console.log(left, right);
}
`,
      createConfig({
        ts: false,
        perfectionist: false,
        react: false,
      }),
    );

    expect(severitiesByRule(result)).toMatchObject({
      eqeqeq: 2,
    });
  });

  it('warns on extreme production size while excluding test filenames', async () => {
    const config = createConfig({
      ts: false,
      perfectionist: false,
      react: false,
    });
    const oversizedSource = [
      'function oversized() {',
      ...Array.from({ length: 301 }, (_, index) => `  console.log(${index});`),
      '}',
      ...Array.from({ length: 700 }, (_, index) => `export const value${index} = ${index};`),
      ...Array.from({ length: 9 }, () => 'if (true) {'),
      '  console.log("nested");',
      ...Array.from({ length: 9 }, () => '}'),
    ].join('\n');
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: config,
    });

    const [sourceResult] = await eslint.lintText(oversizedSource, { filePath: 'fixture.js' });
    const [testResult] = await eslint.lintText(oversizedSource, {
      filePath: 'fixture.test.js',
    });

    expect(severitiesByRule(sourceResult)).toMatchObject({
      'max-depth': 1,
      'max-lines': 1,
      'max-lines-per-function': 1,
    });
    expect(messagesForRule(testResult, 'max-depth')).toEqual([]);
    expect(messagesForRule(testResult, 'max-lines')).toEqual([]);
    expect(messagesForRule(testResult, 'max-lines-per-function')).toEqual([]);
  });

  it('separates structural and multiline declarations while preserving compact groups', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: createConfig(
        {
          perfectionist: false,
          react: false,
          ts: false,
        },
        {
          files: ['**/*.ts'],
          languageOptions: {
            parserOptions: {
              projectService: false,
            },
          },
        },
      ),
      fix: true,
    });

    const [result] = await eslint.lintText(
      `
type UserId = string;
type SessionId = string;
type User = {
  id: UserId;
};
type Session = {
  id: SessionId;
};
interface Account {
  id: string;
}
interface Profile {
  account: Account;
}
const add = (left: number, right: number) => left + right;
const subtract = (left: number, right: number) => left - right;
const addMany = (values: number[]) => {
  return values.reduce((total, value) => total + value, 0);
};
const subtractMany = (values: number[]) => {
  return values.reduce((total, value) => total - value, 0);
};
function parse(value: string): string;

function parse(value: number): number;

function parse(value: string | number): string | number {
  return value;
}
`,
      { filePath: 'fixture.ts' },
    );

    expect(result.output).toBe(`
type UserId = string;
type SessionId = string;

type User = {
  id: UserId;
};

type Session = {
  id: SessionId;
};

interface Account {
  id: string;
}

interface Profile {
  account: Account;
}

const add = (left: number, right: number) => left + right;
const subtract = (left: number, right: number) => left - right;

const addMany = (values: number[]) => {
  return values.reduce((total, value) => total + value, 0);
};

const subtractMany = (values: number[]) => {
  return values.reduce((total, value) => total - value, 0);
};

function parse(value: string): string;
function parse(value: number): number;
function parse(value: string | number): string | number {
  return value;
}
`);

    const [exportedResult] = await eslint.lintText(
      `
export type UserId = string;
export type SessionId = string;
export interface User {
  id: UserId;
}
export class UserService {}
export const add = (left: number, right: number) => left + right;
export const subtract = (left: number, right: number) => left - right;
export const addMany = (values: number[]) => {
  return values.reduce((total, value) => total + value, 0);
};
export default (values: number[]) => {
  return values.reduce((total, value) => total - value, 0);
};
`,
      { filePath: 'exported-fixture.ts' },
    );

    expect(exportedResult.output).toBe(`
export type UserId = string;
export type SessionId = string;

export interface User {
  id: UserId;
}

export class UserService {}

export const add = (left: number, right: number) => left + right;
export const subtract = (left: number, right: number) => left - right;

export const addMany = (values: number[]) => {
  return values.reduce((total, value) => total + value, 0);
};

export default (values: number[]) => {
  return values.reduce((total, value) => total - value, 0);
};
`);
  });

  it('sorts adjacent exports without crossing blank lines or comments', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: createConfig({
        ts: false,
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

async function lintJs(
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
