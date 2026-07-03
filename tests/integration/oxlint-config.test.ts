import { afterEach, describe, expect, it } from 'vitest';
import { type TempProject, createTempProject } from '../helpers/temp-project.js';

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
        'typescript(no-explicit-any)',
        'typescript(no-unsafe-call)',
        'react-hooks(rules-of-hooks)',
      ]),
    );
  });
});

async function writeOxlintProject(project: TempProject): Promise<void> {
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
import config from '@retn0/oxlint-config';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [config],
});
`,
  );
}

function diagnosticCodes(stdout: string): string[] {
  const output = JSON.parse(stdout) as { diagnostics: Array<{ code: string }> };
  return output.diagnostics.map((diagnostic) => diagnostic.code).sort();
}
