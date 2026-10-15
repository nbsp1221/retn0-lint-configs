import createConfig from '@retn0/eslint-config';
import eslintConfigOxlint from '@retn0/eslint-config-oxlint';
import { ESLint } from 'eslint';
import ts from 'typescript';
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

  it('enforces shared TypeScript defaults without duplicate reports when combined', async () => {
    project = await createTempProject('shared-ts-defaults');
    await project.writeFile('package.json', JSON.stringify({ type: 'module' }));
    await project.writeFile(
      'tsconfig.json',
      JSON.stringify({ compilerOptions: { strict: true, target: 'ESNext' }, include: ['*.ts'] }),
    );
    await project.writeFile(
      'oxlint.config.ts',
      "import retn0 from '@retn0/oxlint-config';\nexport default retn0();\n",
    );
    await project.writeFile(
      'unsafe.ts',
      `
export const spread = { ...Promise.resolve(1) };
export const numbers = [20, 3].sort();
export class Store {
  constructor(public value: string) { this.value = value; }
}
export function label({ name = 'guest' }: { name: string }): string { return name; }

export async function load() {
  try {
    return Promise.resolve(1);
  } catch {
    return 0;
  }
}

export const fallback = Promise.resolve(1).catch(error => {
  console.error(error);

  return 0;
});

export class Cache {
  private value = 1;

  read(): number { return this.value; }
}

export function count(value: number): number { return Number(value); }
`,
    );
    await project.writeFile(
      'safe.ts',
      `
export const source = { value: 1 };
export const spread = { ...source };
export const numbers = [20, 3].sort((left, right) => left - right);
export class Store {
  constructor(public value: string) {}
}
export function label({ name = 'guest' }: { name?: string }): string { return name; }

export async function load() {
  try {
    return await Promise.resolve(1);
  } catch {
    return 0;
  }
}

export async function delegate() { return Promise.resolve(1); }

export async function awaitDelegate() { return await Promise.resolve(1); }

export const fallback = Promise.resolve(1).catch((error: unknown) => {
  console.error(error);

  return 0;
});

export class Cache {
  private readonly values = new Map<string, number>();

  set(key: string, value: number): void { this.values.set(key, value); }

  get(key: string): number | undefined { return this.values.get(key); }
}

export class Counter {
  private value = 0;

  increment(): number {
    this.value += 1;

    return this.value;
  }
}

export function count(value: number): number { return value; }

export function parse(value: string | number): number { return Number(value); }
`,
    );

    const rules = [
      'no-misused-spread',
      'require-array-sort-compare',
      'no-unnecessary-parameter-property-assignment',
      'no-useless-default-assignment',
      'return-await',
      'use-unknown-in-catch-callback-variable',
      'prefer-readonly',
      'no-unnecessary-type-conversion',
    ];
    const options = { environments: ['node' as const], perfectionist: false, react: false };
    const standalone = new ESLint({
      cwd: project.root,
      overrideConfigFile: true,
      overrideConfig: createConfig(options),
    });
    const results = await standalone.lintFiles(['unsafe.ts', 'safe.ts']);
    const combined = new ESLint({
      cwd: project.root,
      overrideConfigFile: true,
      overrideConfig: createConfig(options, eslintConfigOxlint),
    });
    const combinedResults = await combined.lintFiles(['unsafe.ts', 'safe.ts']);
    const unsafeResult = await project.runBin('oxlint', ['--format=json', 'unsafe.ts']);
    const safeResult = await project.runBin('oxlint', ['--format=json', 'safe.ts']);

    expect(results.flatMap((result) => result.messages.filter((message) => message.fatal))).toEqual(
      [],
    );
    expect(
      combinedResults.flatMap((result) => result.messages.filter((message) => message.fatal)),
    ).toEqual([]);
    expect(unsafeResult.exitCode).toBe(1);
    expect(safeResult.exitCode, safeResult.stdout).toBe(0);

    for (const rule of rules) {
      const ruleId = `@typescript-eslint/${rule}`;

      expect(
        results.flatMap((result) => result.messages.filter((message) => message.ruleId === ruleId)),
      ).toEqual([expect.objectContaining({ severity: 2 })]);
      expect(
        results
          .find((result) => result.filePath.endsWith('/safe.ts'))
          ?.messages.some((message) => message.ruleId === ruleId),
      ).toBe(false);
      expect(
        combinedResults.flatMap((result) =>
          result.messages.filter((message) => message.ruleId === ruleId),
        ),
      ).toEqual([]);
      expect(unsafeResult.stdout).toContain(`typescript(${rule})`);
      expect(safeResult.stdout).not.toContain(`typescript(${rule})`);
    }
  });

  it('preserves getter reads and private namespace types when fixing either setup', async () => {
    project = await createTempProject('ts-side-effects-and-visibility');
    await project.writeFile('package.json', JSON.stringify({ type: 'module' }));
    await project.writeFile(
      'tsconfig.json',
      JSON.stringify({ compilerOptions: { strict: true, target: 'ESNext' }, include: ['*.ts'] }),
    );
    await project.writeFile(
      'oxlint.config.ts',
      `
import retn0 from '@retn0/oxlint-config';
export default retn0({
  overrides: [{ files: ['fixture.ts'], rules: { 'typescript/no-namespace': 'off' } }],
});
`,
    );
    const fixture = `
let reads = 0;
const subject = { get value(): number { reads += 1; return reads; } };
void subject.value;
export { reads };
export declare namespace Library {
  interface Hidden { readonly value: string; }
  export interface Public { readonly hidden: Hidden; }
  export {};
}
`;
    await project.writeFile('fixture.ts', fixture);
    await project.writeFile(
      'consumer.ts',
      "import type { Library } from './fixture.js';\nexport type Leaked = Library.Hidden;\n",
    );
    const root = project.root;

    function typeDiagnostics(): number[] {
      const program = ts.createProgram([`${root}/fixture.ts`, `${root}/consumer.ts`], {
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        types: [],
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.NodeNext,
        moduleResolution: ts.ModuleResolutionKind.NodeNext,
      });

      return ts.getPreEmitDiagnostics(program).map((diagnostic) => diagnostic.code);
    }

    expect(typeDiagnostics()).toEqual([2694]);

    for (const mode of ['eslint', 'combined', 'oxlint']) {
      await project.writeFile('fixture.ts', fixture);

      if (mode !== 'eslint') {
        const result = await project.runBin('oxlint', ['--fix', '--format=json', 'fixture.ts']);

        expect(result.exitCode, result.stdout).toBe(0);
      }

      if (mode !== 'oxlint') {
        const eslint = new ESLint({
          cwd: root,
          overrideConfigFile: true,
          fix: true,
          overrideConfig: createConfig(
            { react: false },
            mode === 'combined' ? eslintConfigOxlint : [],
            {
              // Isolate the visibility regression from the separate namespace style policy.
              rules: { '@typescript-eslint/no-namespace': 'off' },
            },
          ),
        });
        const results = await eslint.lintFiles(['fixture.ts']);

        expect(results.flatMap((result) => result.messages)).toEqual([]);
        await ESLint.outputFixes(results);
      }

      const fixed = await project.readFile('fixture.ts');

      expect(fixed).toContain('void subject.value;');
      expect(fixed).toContain('export {};');
      expect(typeDiagnostics()).toEqual([2694]);
    }

    // Removing the empty export exposes Hidden, so the compiler must stop rejecting the consumer.
    await project.writeFile('fixture.ts', fixture.replace('  export {};\n', ''));
    expect(typeDiagnostics()).toEqual([]);
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
  it('reports non-null assertions in either tool without duplicate reports when combined', async () => {
    project = await createTempProject('non-null-assertions');
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
      'export function read(value: { name: string } | undefined): string { return value!.name; }\n',
    );
    await project.writeFile(
      'safe.ts',
      `
export function read(value: { name: string } | undefined): string {
  if (value === undefined) {
    throw new Error('User not found');
  }

  return value.name;
}

export class Service {
  value!: string;
}
`,
    );

    const options = { perfectionist: false, react: false };
    const ruleId = '@typescript-eslint/no-non-null-assertion';
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
    expect(unsafeResult.stdout).toContain('typescript(no-non-null-assertion)');
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
