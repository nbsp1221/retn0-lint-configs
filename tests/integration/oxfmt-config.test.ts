import { afterEach, describe, expect, it } from 'vitest';
import { type TempProject, createTempProject } from '../helpers/temp-project.js';

let project: TempProject | undefined;

describe('oxfmt config behavior', () => {
  afterEach(async () => {
    await project?.cleanup();
    project = undefined;
  });

  it('formats a consumer project through oxfmt.config.ts', async () => {
    project = await createTempProject('oxfmt-config');
    await project.writeFile('package.json', JSON.stringify({ type: 'module' }, undefined, 2));
    await project.writeFile(
      'oxfmt.config.ts',
      `
import config from '@retn0/oxfmt-config';
import { defineConfig } from 'oxfmt';

export default defineConfig(config);
`,
    );
    await project.writeFile(
      'index.ts',
      `
import zeta from "zeta";
import fs from "node:fs";
import { b, a } from "pkg";
import alpha from "alpha";

const fn = x => ({foo: "bar", baz: "qux"});

console.log(fn(a), b, alpha, fs, zeta);
`,
    );

    const result = await project.runBin('oxfmt', ['index.ts']);

    expect(result.exitCode).toBe(0);
    expect(await project.readFile('index.ts')).toBe(`import fs from 'node:fs';
import alpha from 'alpha';
import { b, a } from 'pkg';
import zeta from 'zeta';

const fn = (x) => ({ foo: 'bar', baz: 'qux' });

console.log(fn(a), b, alpha, fs, zeta);
`);
  });
});
