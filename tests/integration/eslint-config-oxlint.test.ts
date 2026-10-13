import createConfig from '@retn0/eslint-config';
import eslintConfigOxlint from '@retn0/eslint-config-oxlint';
import { ESLint } from 'eslint';
import { afterEach, describe, expect, it } from 'vitest';
import { type TempProject, createTempProject } from '../helpers/temp-project.js';

let project: TempProject | undefined;

describe('eslint oxlint compatibility behavior', () => {
  afterEach(async () => {
    await project?.cleanup();
    project = undefined;
  });

  it('turns off ESLint duplicates handled by Oxlint', async () => {
    project = await createTempProject('eslint-config-oxlint');
    await project.writeFile('package.json', JSON.stringify({ type: 'module' }, undefined, 2));
    await project.writeFile(
      'eslint.config.js',
      `
import retn0 from '@retn0/eslint-config';
import eslintConfigOxlint from '@retn0/eslint-config-oxlint';

export default retn0(
  {
    environments: ['node'],
    ts: false,
    perfectionist: false,
    react: false,
  },
  eslintConfigOxlint,
);
`,
    );
    await project.writeFile(
      'fixture.js',
      `
var left = 1;
const right = 2;

if (left == right) {
  console.log(left, right);
}

while (left) {
  break;
}
`,
    );

    const result = await project.runBin('eslint', ['--format=json', 'fixture.js']);
    const ruleIds = eslintRuleIds(result.stdout);

    expect(result.exitCode).toBe(0);
    expect(ruleIds).toEqual([]);
  });

  it('reports unsafe assertions in either tool without duplicate reports when combined', async () => {
    project = await createTempProject('unsafe-type-assertions');
    await project.writeFile('package.json', JSON.stringify({ type: 'module' }));
    await project.writeFile(
      'tsconfig.json',
      JSON.stringify({ compilerOptions: { strict: true }, include: ['*.ts'] }),
    );
    await project.writeFile(
      'oxlint.config.ts',
      "import retn0 from '@retn0/oxlint-config';\nexport default retn0();\n",
    );
    await project.writeFile(
      'unsafe.ts',
      'export function read(value: unknown): string { return value as string; }\n',
    );
    await project.writeFile(
      'safe.ts',
      `
export function read(value: unknown): string {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  return value;
}

export function widen(value: string): string | number {
  const widened = value as string | number;

  return widened;
}
`,
    );

    const options = { perfectionist: false, react: false };
    const ruleId = '@typescript-eslint/no-unsafe-type-assertion';
    const standalone = new ESLint({
      cwd: project.root,
      overrideConfigFile: true,
      overrideConfig: createConfig(options),
    });
    const results = await standalone.lintFiles(['unsafe.ts', 'safe.ts']);

    expect(
      results.flatMap((result) => result.messages.filter((message) => message.ruleId === ruleId)),
    ).toEqual([expect.objectContaining({ severity: 2 })]);
    expect(results.find((result) => result.filePath.endsWith('/safe.ts'))?.messages).toEqual([]);

    const combined = new ESLint({
      cwd: project.root,
      overrideConfigFile: true,
      overrideConfig: createConfig(options, eslintConfigOxlint),
    });
    const combinedResults = await combined.lintFiles(['unsafe.ts', 'safe.ts']);

    expect(
      combinedResults.flatMap((result) =>
        result.messages.filter((message) => message.ruleId === ruleId),
      ),
    ).toEqual([]);

    const unsafeResult = await project.runBin('oxlint', ['--format=json', 'unsafe.ts']);
    const safeResult = await project.runBin('oxlint', ['--format=json', 'safe.ts']);

    expect(unsafeResult.exitCode).toBe(1);
    expect(unsafeResult.stdout).toContain('typescript(no-unsafe-type-assertion)');
    expect(safeResult.exitCode).toBe(0);
  });
  it('reports unnecessary conditions while allowing literal loops and runtime type guards', async () => {
    project = await createTempProject('unnecessary-conditions');
    await project.writeFile('package.json', JSON.stringify({ type: 'module' }));
    await project.writeFile(
      'tsconfig.json',
      JSON.stringify({ compilerOptions: { strict: true }, include: ['*.ts'] }),
    );
    await project.writeFile(
      'oxlint.config.ts',
      "import retn0 from '@retn0/oxlint-config';\nexport default retn0();\n",
    );
    await project.writeFile(
      'unnecessary.ts',
      'export function hasItems(items: string[]): boolean { return items ? true : false; }\n',
    );
    await project.writeFile(
      'necessary.ts',
      `
export function hasItems(items: string[]): boolean {
  return items.length > 0;
}

export function poll(ready: () => boolean): void {
  while (true) {
    if (ready()) {
      return;
    }
  }
}

declare function isString(value: unknown): value is string;

export function validate(value: string): boolean {
  return isString(value);
}
`,
    );

    const options = { perfectionist: false, react: false };
    const ruleId = '@typescript-eslint/no-unnecessary-condition';
    const standalone = new ESLint({
      cwd: project.root,
      overrideConfigFile: true,
      overrideConfig: createConfig(options),
    });
    const results = await standalone.lintFiles(['unnecessary.ts', 'necessary.ts']);

    expect(
      results.flatMap((result) => result.messages.filter((message) => message.ruleId === ruleId)),
    ).toEqual([expect.objectContaining({ severity: 2 })]);
    expect(results.find((result) => result.filePath.endsWith('/necessary.ts'))?.messages).toEqual(
      [],
    );

    const combined = new ESLint({
      cwd: project.root,
      overrideConfigFile: true,
      overrideConfig: createConfig(options, eslintConfigOxlint),
    });
    const combinedResults = await combined.lintFiles(['unnecessary.ts', 'necessary.ts']);

    expect(
      combinedResults.flatMap((result) =>
        result.messages.filter((message) => message.ruleId === ruleId),
      ),
    ).toEqual([]);

    const unnecessaryResult = await project.runBin('oxlint', ['--format=json', 'unnecessary.ts']);
    const necessaryResult = await project.runBin('oxlint', ['--format=json', 'necessary.ts']);

    expect(unnecessaryResult.exitCode).toBe(1);
    expect(unnecessaryResult.stdout).toContain('typescript(no-unnecessary-condition)');
    expect(necessaryResult.exitCode).toBe(0);
  });
});

function eslintRuleIds(stdout: string): string[] {
  // The local ESLint CLI produces this JSON schema.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const output = JSON.parse(stdout) as Array<{
    messages: Array<{ ruleId: string | null }>;
  }>;

  return output.flatMap((result) =>
    result.messages
      .map((message) => message.ruleId)
      .filter((ruleId): ruleId is string => Boolean(ruleId)),
  );
}
