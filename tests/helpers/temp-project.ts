import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const repoNodeModules = join(repoRoot, 'node_modules');
const commandMaxBuffer = 10 * 1024 * 1024;
const commandTimeoutMs = 30_000;
const supportedBinNames = new Set(['eslint', 'oxfmt', 'oxlint']);

export interface CommandResult {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

export interface TempProject {
  readonly root: string;
  writeFile(path: string, content: string): Promise<void>;
  readFile(path: string): Promise<string>;
  runBin(binName: string, args: string[]): Promise<CommandResult>;
  cleanup(): Promise<void>;
}

export async function createTempProject(name: string): Promise<TempProject> {
  const root = await mkdtemp(join(tmpdir(), `retn0-${name}-`));
  await symlink(repoNodeModules, join(root, 'node_modules'), 'dir');

  return {
    root,
    async writeFile(path, content) {
      const filePath = resolveProjectPath(root, path);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, content, 'utf8');
    },
    async readFile(path) {
      return readFile(resolveProjectPath(root, path), 'utf8');
    },
    async runBin(binName, args) {
      return runCommand(resolveBinPath(binName), args, root);
    },
    async cleanup() {
      await rm(root, { recursive: true, force: true });
    },
  };
}

async function runCommand(command: string, args: string[], cwd: string): Promise<CommandResult> {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      cwd,
      maxBuffer: commandMaxBuffer,
      timeout: commandTimeoutMs,
    });
    return {
      exitCode: 0,
      stdout,
      stderr,
    };
  } catch (error: unknown) {
    if (isExecError(error)) {
      return {
        exitCode: typeof error.code === 'number' ? error.code : 1,
        stdout: error.stdout,
        stderr: error.stderr,
      };
    }

    throw error;
  }
}

function resolveBinPath(binName: string): string {
  if (binName !== basename(binName) || !supportedBinNames.has(binName)) {
    throw new Error(`Unsupported test binary: ${binName}`);
  }

  return join(repoRoot, 'node_modules/.bin', binName);
}

function resolveProjectPath(root: string, path: string): string {
  if (isAbsolute(path)) {
    throw new Error(`Temp project path must be relative: ${path}`);
  }

  const filePath = resolve(root, path);
  const relativePath = relative(root, filePath);

  if (relativePath === '' || (!relativePath.startsWith('..') && !isAbsolute(relativePath))) {
    return filePath;
  }

  throw new Error(`Temp project path escapes project root: ${path}`);
}

function isExecError(error: unknown): error is { code?: number; stdout: string; stderr: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'stdout' in error &&
    typeof error.stdout === 'string' &&
    'stderr' in error &&
    typeof error.stderr === 'string'
  );
}
