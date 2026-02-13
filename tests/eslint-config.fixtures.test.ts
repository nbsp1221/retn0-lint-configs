import {
  cp,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { type CreateConfigsOptions, createConfigs } from '@retn0/eslint-config';
import { ESLint } from 'eslint';
import { afterAll, describe, expect, it } from 'vitest';

const FIXTURES_ROOT = resolve('tests/fixtures');
const INPUT_ROOT = join(FIXTURES_ROOT, 'input');
const OUTPUT_ROOT = join(FIXTURES_ROOT, 'output');
const UPDATE_FIXTURES = process.env.UPDATE_FIXTURES === '1';

interface Suite {
  name: string;
  options: CreateConfigsOptions;
}

interface LintDiagnostic {
  filePath: string;
  errorCount: number;
  warningCount: number;
  messages: Array<{
    ruleId: string | null;
    severity: number;
    line: number;
    column: number;
    endLine?: number;
    endColumn?: number;
  }>;
}

const suites: Suite[] = [
  {
    name: 'default',
    options: {},
  },
];

const tempDirs: string[] = [];

describe('eslint fixtures regression', () => {
  for (const suite of suites) {
    it(`matches fixed output and diagnostics (${suite.name})`, async () => {
      const inputSuiteDir = join(INPUT_ROOT, suite.name);
      const outputSuiteDir = join(OUTPUT_ROOT, suite.name);
      const tempRoot = await mkdtemp(join(tmpdir(), `retn0-fixtures-${suite.name}-`));
      const tempSuiteDir = join(tempRoot, suite.name);

      tempDirs.push(tempRoot);

      await cp(inputSuiteDir, tempSuiteDir, { recursive: true });
      await materializeTxtFixtures(tempSuiteDir);

      const eslint = new ESLint({
        cwd: tempSuiteDir,
        overrideConfigFile: true,
        overrideConfig: createConfigs(suite.options),
        fix: true,
      });

      const results = await eslint.lintFiles(['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']);
      await ESLint.outputFixes(results);

      const materializedFiles = await listMaterializedFiles(tempSuiteDir);
      const actualOutputs = await readFilesAsText(tempSuiteDir, materializedFiles);
      const diagnostics = serializeDiagnostics(results, tempSuiteDir);

      if (UPDATE_FIXTURES) {
        await writeFixtureOutputs(outputSuiteDir, actualOutputs, diagnostics);
        expect(true).toBe(true);
        return;
      }

      const expectedOutputs = await readExpectedOutputs(outputSuiteDir);
      const expectedDiagnostics = await readExpectedDiagnostics(outputSuiteDir);

      expect(actualOutputs).toEqual(expectedOutputs);
      expect(diagnostics).toEqual(expectedDiagnostics);
    });
  }
});

afterAll(async () => {
  await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
});

async function materializeTxtFixtures(rootDir: string): Promise<void> {
  const files = await listFiles(rootDir);
  await Promise.all(files.map(async (file) => {
    if (!file.endsWith('.txt')) {
      return;
    }

    const fromPath = join(rootDir, file);
    const toRelativePath = file.slice(0, -4);
    const toPath = join(rootDir, toRelativePath);
    const content = await readFile(fromPath, 'utf8');

    await mkdir(dirname(toPath), { recursive: true });
    await writeFile(toPath, content, 'utf8');
    await rm(fromPath, { force: true });
  }));
}

async function listFiles(rootDir: string): Promise<string[]> {
  const result: string[] = [];

  async function walk(currentDir: string): Promise<void> {
    const entries = await readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      const relPath = relative(rootDir, fullPath).replaceAll('\\', '/');
      result.push(relPath);
    }
  }

  await walk(rootDir);
  return result.sort();
}

async function listMaterializedFiles(rootDir: string): Promise<string[]> {
  return listFiles(rootDir);
}

async function readFilesAsText(
  rootDir: string,
  files: string[],
): Promise<Record<string, string>> {
  const entries = await Promise.all(files.map(async (file) => {
    const content = await readFile(join(rootDir, file), 'utf8');
    return [file, content] as const;
  }));

  return Object.fromEntries(entries.sort(([a], [b]) => a.localeCompare(b)));
}

function serializeDiagnostics(results: ESLint.LintResult[], cwd: string): LintDiagnostic[] {
  return results
    .map(result => ({
      filePath: relative(cwd, result.filePath).replaceAll('\\', '/'),
      errorCount: result.errorCount,
      warningCount: result.warningCount,
      messages: result.messages.map(message => ({
        ruleId: message.ruleId,
        severity: message.severity,
        line: message.line,
        column: message.column,
        endLine: message.endLine,
        endColumn: message.endColumn,
      })),
    }))
    .sort((a, b) => a.filePath.localeCompare(b.filePath));
}

async function writeFixtureOutputs(
  outputSuiteDir: string,
  outputs: Record<string, string>,
  diagnostics: LintDiagnostic[],
): Promise<void> {
  await rm(outputSuiteDir, { recursive: true, force: true });
  await mkdir(outputSuiteDir, { recursive: true });

  await Promise.all(Object.entries(outputs).map(async ([file, content]) => {
    const outputPath = join(outputSuiteDir, `${file}.txt`);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, content, 'utf8');
  }));

  await writeFile(
    join(outputSuiteDir, '__diagnostics__.json'),
    `${JSON.stringify(diagnostics, null, 2)}\n`,
    'utf8',
  );
}

async function readExpectedOutputs(outputSuiteDir: string): Promise<Record<string, string>> {
  const files = await listFiles(outputSuiteDir);
  const expectedFiles = files.filter(file => file.endsWith('.txt'));
  const entries = await Promise.all(expectedFiles.map(async (file) => {
    const content = await readFile(join(outputSuiteDir, file), 'utf8');
    const materializedFile = file.slice(0, -4);
    return [materializedFile, content] as const;
  }));

  return Object.fromEntries(entries.sort(([a], [b]) => a.localeCompare(b)));
}

async function readExpectedDiagnostics(outputSuiteDir: string): Promise<LintDiagnostic[]> {
  const diagnosticsPath = join(outputSuiteDir, '__diagnostics__.json');
  const content = await readFile(diagnosticsPath, 'utf8');
  return JSON.parse(content) as LintDiagnostic[];
}
