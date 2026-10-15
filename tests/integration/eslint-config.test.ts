import type { Linter } from 'eslint';
import { createOxlintConfig } from '@retn0/common';
import createConfig from '@retn0/eslint-config';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';
import {
  vitestCandidateRuleIds,
  vitestCandidateViolations,
  vitestRecommendedRuleIds,
  vitestRecommendedViolations,
} from '../helpers/vitest-fixtures.js';

describe('eslint config behavior', () => {
  it('rejects unsupported environments', () => {
    expect(() =>
      createConfig({
        // @ts-expect-error Exercise runtime validation with an unsupported environment.
        environments: ['invalid-runtime'],
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

while (left) {
  break;
}
`,
      createConfig({
        ts: false,
        perfectionist: false,
        react: false,
      }),
    );

    expect(severitiesByRule(result)).toMatchObject({
      'eqeqeq': 2,
      'no-unreachable-loop': 2,
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

describe('eslint vitest option', () => {
  const vitestGlobalsMessages = [
    "'expect' is not defined.",
    "'describe' is not defined.",
    "'it' is not defined.",
    "'vi' is not defined.",
  ];

  it('does not enable Vitest rules or globals by default', async () => {
    const config = createConfig({ ts: false, perfectionist: false, react: false });
    const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: config });

    const [result] = await eslint.lintText(vitestRecommendedViolations, {
      filePath: 'fixture.test.js',
    });

    expect(vitestRuleIdsOf(result)).toEqual([]);
    expect(uniqueMessagesForRule(result, 'no-undef')).toEqual(
      expect.arrayContaining(vitestGlobalsMessages),
    );
    expect(config.map((entry) => entry.name)).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/^retn0\/vitest/u)]),
    );
  });

  it('reports recommended Vitest rules with plugin severities in test files only', async () => {
    const config = createConfig({ ts: false, perfectionist: false, react: false, vitest: true });
    const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: config });

    const [testResult] = await eslint.lintText(vitestRecommendedViolations, {
      filePath: 'fixture.test.js',
    });
    const [sourceResult] = await eslint.lintText(vitestRecommendedViolations, {
      filePath: 'fixture.js',
    });

    expect(vitestRuleIdsOf(testResult)).toEqual(vitestRecommendedRuleIds);
    expect(vitestSeveritiesOf(testResult)).toEqual(recommendedSeverities(config));
    expect(messagesForRule(testResult, 'no-undef')).toEqual([]);

    expect(vitestRuleIdsOf(sourceResult)).toEqual([]);
    expect(uniqueMessagesForRule(sourceResult, 'no-undef')).toEqual(
      expect.arrayContaining(vitestGlobalsMessages),
    );
  });

  it('keeps Vitest rules outside the recommended preset off', async () => {
    const config = createConfig({ ts: false, perfectionist: false, react: false, vitest: true });
    const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: config });

    const [result] = await eslint.lintText(vitestCandidateViolations, {
      filePath: 'fixture.test.js',
    });
    // ESLint returns the resolved config as any.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const resolved = (await eslint.calculateConfigForFile('fixture.test.js')) as Linter.Config;

    expect(vitestRuleIdsOf(result)).toEqual([]);
    expect(
      Object.fromEntries(
        vitestCandidateRuleIds.map((ruleId) => [ruleId, severityName(resolved.rules?.[ruleId])]),
      ),
    ).toEqual(Object.fromEntries(vitestCandidateRuleIds.map((ruleId) => [ruleId, 'off'])));
  });

  it('reports the candidate Vitest rules when they are enabled', async () => {
    const config = createConfig(
      { ts: false, perfectionist: false, react: false, vitest: true },
      {
        files: ['**/*.test.js'],
        rules: Object.fromEntries(vitestCandidateRuleIds.map((ruleId) => [ruleId, 'error'])),
      },
    );
    const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: config });

    const [result] = await eslint.lintText(vitestCandidateViolations, {
      filePath: 'fixture.test.js',
    });

    expect(vitestRuleIdsOf(result)).toEqual(vitestCandidateRuleIds);
  });

  it('enables exactly the @vitest/eslint-plugin recommended preset', () => {
    const config = createConfig({ vitest: true });
    const enabledRules = Object.fromEntries(
      config
        .filter((entry) => entry.name?.startsWith('retn0/vitest'))
        .flatMap((entry) => Object.entries(entry.rules ?? {}))
        .map(([ruleId, entry]) => [ruleId, severityName(entry)] as const)
        .filter(([, severity]) => severity !== 'off'),
    );

    expect(enabledRules).toEqual(recommendedSeverities(config));
  });

  it('resolves the same Vitest rule set as the Oxlint config', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: createConfig({ vitest: true }),
    });
    // ESLint returns the resolved config as any.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const resolved = (await eslint.calculateConfigForFile('fixture.test.ts')) as Linter.Config;
    const eslintRules = Object.fromEntries(
      Object.entries(resolved.rules ?? {})
        .filter(([ruleId]) => ruleId.startsWith('vitest/'))
        .map(([ruleId, entry]) => [ruleId, severityName(entry)]),
    );

    const oxlintRules = Object.fromEntries(
      (createOxlintConfig().overrides ?? [])
        .flatMap((override) => Object.entries(override.rules ?? {}))
        .filter(([ruleId]) => ruleId.startsWith('vitest/'))
        .map(([ruleId, entry]) => [ruleId, severityName(entry)]),
    );

    expect(Object.keys(eslintRules).sort()).toEqual(
      [...vitestRecommendedRuleIds, ...vitestCandidateRuleIds].sort(),
    );
    expect(eslintRules).toEqual(oxlintRules);
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
    result.messages.flatMap((message) =>
      message.ruleId ? [[message.ruleId, message.severity]] : [],
    ),
  );
}

function uniqueMessagesForRule(result: ESLint.LintResult, ruleId: string): string[] {
  return [...new Set(messagesForRule(result, ruleId))];
}

function vitestRuleIdsOf(result: ESLint.LintResult): string[] {
  return [
    ...new Set(
      result.messages
        .map((message) => message.ruleId)
        .filter((ruleId): ruleId is string => ruleId?.startsWith('vitest/') ?? false),
    ),
  ].sort();
}

function vitestSeveritiesOf(result: ESLint.LintResult): Record<string, string> {
  return Object.fromEntries(
    result.messages.flatMap((message) =>
      message.ruleId?.startsWith('vitest/')
        ? [[message.ruleId, message.severity === 2 ? 'error' : 'warn']]
        : [],
    ),
  );
}

function recommendedSeverities(config: Linter.Config[]): Record<string, string> {
  const setup = config.find((entry) => entry.name === 'retn0/vitest/setup');
  // The configured plugin is @vitest/eslint-plugin; ESLint's generic Plugin type
  // does not expose its recommended config shape.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const plugin = setup?.plugins?.vitest as
    | { configs: { recommended: { rules: Record<string, Linter.RuleEntry> } } }
    | undefined;

  if (!plugin) {
    throw new Error('Missing retn0/vitest/setup plugin');
  }

  return Object.fromEntries(
    Object.entries(plugin.configs.recommended.rules).map(([ruleId, entry]) => [
      ruleId,
      severityName(entry),
    ]),
  );
}

function severityName(entry: unknown): string {
  const severity: unknown = Array.isArray(entry) ? entry[0] : entry;

  switch (severity) {
    case 2:
    case 'error':
      return 'error';
    case 1:
    case 'warn':
      return 'warn';
    case undefined:
    case 0:
    case 'off':
      return 'off';
    default:
      throw new TypeError('Unexpected lint rule severity');
  }
}
