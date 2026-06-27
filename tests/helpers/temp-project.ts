import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const repoNodeModules = join(repoRoot, 'node_modules');

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
      const filePath = join(root, path);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, content, 'utf8');
    },
    async readFile(path) {
      return readFile(join(root, path), 'utf8');
    },
    async runBin(binName, args) {
      return runCommand(join(repoRoot, 'node_modules/.bin', binName), args, root);
    },
    async cleanup() {
      await rm(root, { recursive: true, force: true });
    },
  };
}

async function runCommand(command: string, args: string[], cwd: string): Promise<CommandResult> {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, { cwd });
    return {
      exitCode: 0,
      stdout,
      stderr,
    };
  } catch (error: unknown) {
    if (isExecError(error)) {
      return {
        exitCode: error.code ?? 1,
        stdout: error.stdout,
        stderr: error.stderr,
      };
    }

    throw error;
  }
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
