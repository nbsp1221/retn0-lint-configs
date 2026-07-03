import { afterEach, describe, expect, it } from 'vitest';
import { type TempProject, createTempProject } from '../helpers/temp-project.js';

let project: TempProject | undefined;

afterEach(async () => {
  await project?.cleanup();
  project = undefined;
});

describe('temp project helper', () => {
  it('supports nested relative file paths inside the temp project root', async () => {
    project = await createTempProject('nested-path');

    await project.writeFile('src/index.ts', 'export const value = 1;\n');

    await expect(project.readFile('src/index.ts')).resolves.toBe('export const value = 1;\n');
  });

  it('rejects file paths that escape the temp project root', async () => {
    project = await createTempProject('path-escape');

    await expect(project.writeFile('/tmp/outside.js', '')).rejects.toThrow('must be relative');
    await expect(project.writeFile('../outside.js', '')).rejects.toThrow('escapes project root');
    await expect(project.readFile('../outside.js')).rejects.toThrow('escapes project root');
  });

  it('runs only supported repo binaries', async () => {
    project = await createTempProject('bin-allowlist');

    await expect(project.runBin('../eslint', [])).rejects.toThrow('Unsupported test binary');
    await expect(project.runBin('node', ['--version'])).rejects.toThrow('Unsupported test binary');
  });
});
