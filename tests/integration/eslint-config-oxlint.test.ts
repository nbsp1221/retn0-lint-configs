import { afterEach, describe, expect, it } from 'vitest';
import { type TempProject, createTempProject } from '../helpers/temp-project.js';

let project: TempProject | undefined;

describe('eslint oxlint compatibility behavior', () => {
  afterEach(async () => {
    await project?.cleanup();
    project = undefined;
  });

  it('turns off ESLint duplicates while keeping ESLint-only rules active', async () => {
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
    typescript: false,
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

    expect(result.exitCode).toBe(1);
    expect(ruleIds).toEqual(['no-unreachable-loop']);
  });
});

function eslintRuleIds(stdout: string): string[] {
  const output = JSON.parse(stdout) as Array<{
    messages: Array<{ ruleId: string | null }>;
  }>;

  return output.flatMap((result) =>
    result.messages
      .map((message) => message.ruleId)
      .filter((ruleId): ruleId is string => Boolean(ruleId)),
  );
}
