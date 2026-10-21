import createConfig from '@retn0/oxlint-config';
import { afterEach, describe, expect, it } from 'vitest';
import { type TempProject, createTempProject } from '../helpers/temp-project.js';
import {
  oxlintCodeToRuleId,
  validExpectCases,
  vitestCandidateRuleIds,
  vitestCandidateViolations,
  vitestRecommendedRuleIds,
  vitestRecommendedViolations,
} from '../helpers/vitest-fixtures.js';

let project: TempProject | undefined;

describe('oxlint config behavior', () => {
  afterEach(async () => {
    await project?.cleanup();
    project = undefined;
  });

  it('runs JavaScript, TypeScript, and React rules from a consumer oxlint.config.ts', async () => {
    project = await createTempProject('oxlint-config');
    await writeOxlintProject(project);
    await project.writeFile(
      'index.ts',
      `
const value: any = 1;
value();

const left = 1;
const right = 2;

if (left == right) {
  console.log(left, right);
}

while (left) {
  break;
}
`,
    );
    await project.writeFile(
      'component.tsx',
      `
import { useState } from 'react';

export function Component({ enabled }: { enabled: boolean }) {
  if (enabled) {
    useState(0);
  }

  return null;
}
`,
    );

    const result = await project.runBin('oxlint', ['--format=json', 'index.ts', 'component.tsx']);

    expect(result.exitCode).toBe(1);
    expect(diagnosticCodes(result.stdout)).toEqual(
      expect.arrayContaining([
        'eslint(eqeqeq)',
        'eslint(no-unreachable-loop)',
        'typescript(no-explicit-any)',
        'typescript(no-unsafe-call)',
        'react-hooks(rules-of-hooks)',
      ]),
    );
  });

  it('warns on extreme production size while excluding test filenames', async () => {
    project = await createTempProject('oxlint-config-maintainability');
    await writeOxlintProject(project);
    const oversizedSource = [
      'function oversized() {',
      ...Array.from({ length: 301 }, (_, index) => `  console.log(${index});`),
      '}',
      ...Array.from({ length: 700 }, (_, index) => `export const value${index} = ${index};`),
      ...Array.from({ length: 9 }, () => 'if (true) {'),
      '  console.log("nested");',
      ...Array.from({ length: 9 }, () => '}'),
    ].join('\n');
    await project.writeFile('fixture.js', oversizedSource);
    await project.writeFile('fixture.spec.js', oversizedSource);

    const result = await project.runBin('oxlint', [
      '--format=json',
      'fixture.js',
      'fixture.spec.js',
    ]);
    const diagnostics = diagnosticEntries(result.stdout);

    expect(diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'eslint(max-depth)',
          filename: 'fixture.js',
          severity: 'warning',
        }),
        expect.objectContaining({
          code: 'eslint(max-lines)',
          filename: 'fixture.js',
          severity: 'warning',
        }),
        expect.objectContaining({
          code: 'eslint(max-lines-per-function)',
          filename: 'fixture.js',
          severity: 'warning',
        }),
      ]),
    );
    expect(
      diagnostics.filter(
        (diagnostic) =>
          diagnostic.filename === 'fixture.spec.js' &&
          ['eslint(max-depth)', 'eslint(max-lines)', 'eslint(max-lines-per-function)'].includes(
            diagnostic.code,
          ),
      ),
    ).toEqual([]);
  });

  it('excludes dependencies when the project gitignore lists node_modules', async () => {
    project = await createTempProject('oxlint-config-ignores');
    await writeOxlintProject(project);
    await project.writeFile('.gitignore', 'node_modules/\n');
    await project.writeFile('index.ts', 'const value = 1;\n');

    const result = await project.runBin('oxlint', ['--debug=files', '.']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('index.ts');
    expect(result.stdout).not.toContain('node_modules/');
  });

  // Known upstream limitation: nested config discovery bypasses root ignorePatterns.
  // https://github.com/oxc-project/oxc/issues/27270
  it.todo('excludes dependency configs without a project gitignore', async () => {
    project = await createTempProject('oxlint-config-no-gitignore');
    await writeOxlintProject(project);
    await project.writeFile('index.ts', 'const value = 1;\n');

    const result = await project.runBin('oxlint', ['--debug=files', '.']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('index.ts');
    expect(result.stdout).not.toContain('node_modules/');
  });
});

describe('oxlint vitest options', () => {
  afterEach(async () => {
    await project?.cleanup();
    project = undefined;
  });

  it.each(validExpectCases)('validates expect usage: $code', async ({ code, errors }) => {
    project = await createTempProject('oxlint-config-valid-expect');
    await writeOxlintProject(project);
    await project.writeFile('fixture.test.js', `it('response', () => { ${code} });`);

    const result = await project.runBin('oxlint', ['--format=json', 'fixture.test.js']);
    const diagnostics = diagnosticEntries(result.stdout);

    expect(
      diagnostics.filter(({ code: ruleCode }) => ruleCode === 'vitest(valid-expect)'),
    ).toHaveLength(errors);
  });

  it('scopes the Vitest plugin and globals to test files', () => {
    expect(createConfig({ vitest: true }).overrides).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          files: ['**/*.{test,spec}.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
          plugins: ['vitest'],
          env: { vitest: true },
        }),
      ]),
    );
  });

  it('reports recommended Vitest rules in test files when enabled', async () => {
    project = await createTempProject('oxlint-config-vitest');
    await writeOxlintProject(project, `{ rules: { 'no-undef': 'error' } }`);
    await project.writeFile('fixture.test.js', vitestRecommendedViolations);
    await project.writeFile('fixture.js', vitestRecommendedViolations);

    const result = await project.runBin('oxlint', [
      '--format=json',
      'fixture.test.js',
      'fixture.js',
    ]);
    const diagnostics = diagnosticEntries(result.stdout);
    const testDiagnostics = diagnostics.filter(({ filename }) => filename === 'fixture.test.js');
    const sourceDiagnostics = diagnostics.filter(({ filename }) => filename === 'fixture.js');

    expect(result.exitCode).toBe(1);
    expect(vitestRuleIds(testDiagnostics)).toEqual(vitestRecommendedRuleIds);
    expect(
      testDiagnostics
        .filter(({ code }) => code === 'vitest(no-disabled-tests)')
        .map(({ severity }) => severity),
    ).toEqual(['warning']);
    expect(testDiagnostics.filter(({ code }) => code === 'eslint(no-undef)')).toEqual([]);

    expect(vitestRuleIds(sourceDiagnostics)).toEqual([]);
    expect(sourceDiagnostics.filter(({ code }) => code === 'eslint(no-undef)')).not.toEqual([]);
  });

  it('lets local overrides disable a Vitest default', async () => {
    project = await createTempProject('oxlint-config-vitest-override');
    await writeOxlintProject(
      project,
      `{ overrides: [{ files: ['**/*.test.js'], plugins: ['vitest'], rules: { 'vitest/no-focused-tests': 'off' } }] }`,
    );
    await project.writeFile(
      'fixture.test.js',
      "it.only('focused', () => { expect(1).toBe(1); });\n",
    );

    const result = await project.runBin('oxlint', ['--format=json', 'fixture.test.js']);

    expect(result.exitCode).toBe(0);
    expect(vitestRuleIds(diagnosticEntries(result.stdout))).toEqual([]);
  });

  it('keeps correctness Vitest rules outside the recommended preset off', async () => {
    project = await createTempProject('oxlint-config-vitest-candidates');
    await writeOxlintProject(project);
    await project.writeFile('fixture.test.ts', vitestCandidateViolations);

    const result = await project.runBin('oxlint', ['--format=json', 'fixture.test.ts']);

    expect(vitestRuleIds(diagnosticEntries(result.stdout))).toEqual([]);
  });

  it('reports the candidate Vitest rules when they are enabled', async () => {
    project = await createTempProject('oxlint-config-vitest-candidates-on');
    await writeOxlintProject(
      project,
      `{ overrides: [{ files: ['**/*.test.ts'], plugins: ['vitest'], rules: ${JSON.stringify(
        Object.fromEntries(vitestCandidateRuleIds.map((ruleId) => [ruleId, 'error'])),
      )} }] }`,
    );
    await project.writeFile('fixture.test.ts', vitestCandidateViolations);

    const result = await project.runBin('oxlint', ['--format=json', 'fixture.test.ts']);

    expect(vitestRuleIds(diagnosticEntries(result.stdout))).toEqual(vitestCandidateRuleIds);
  });
});

async function writeOxlintProject(project: TempProject, configArgs = ''): Promise<void> {
  await project.writeFile('package.json', JSON.stringify({ type: 'module' }, undefined, 2));
  await project.writeFile(
    'tsconfig.json',
    JSON.stringify(
      {
        compilerOptions: {
          jsx: 'react-jsx',
          module: 'nodenext',
          moduleResolution: 'nodenext',
          strict: true,
          target: 'ES2024',
        },
        include: ['**/*'],
      },
      undefined,
      2,
    ),
  );
  await project.writeFile(
    'oxlint.config.ts',
    `
import retn0 from '@retn0/oxlint-config';

export default retn0({ react: true, vitest: true }, ${configArgs});
`,
  );
}

function diagnosticCodes(stdout: string): string[] {
  // The local Oxlint CLI produces this JSON schema.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const output = JSON.parse(stdout) as { diagnostics: Array<{ code: string }> };
  return output.diagnostics.map((diagnostic) => diagnostic.code).sort();
}

function diagnosticEntries(
  stdout: string,
): Array<{ code: string; filename: string; severity: string }> {
  // The local Oxlint CLI produces this JSON schema.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const output = JSON.parse(stdout) as {
    diagnostics: Array<{ code: string; filename: string; severity: string }>;
  };
  return output.diagnostics;
}

function vitestRuleIds(diagnostics: Array<{ code: string }>): string[] {
  return [
    ...new Set(
      diagnostics
        .map(({ code }) => oxlintCodeToRuleId(code))
        .filter((ruleId) => ruleId.startsWith('vitest/')),
    ),
  ].sort();
}
