/**
 * Test source that violates every rule in `@vitest/eslint-plugin` `configs.recommended`.
 *
 * It relies on Vitest globals and does not import from `vitest`.
 */
export const vitestRecommendedViolations = `
import { test as nodeTest } from 'node:test';
import { value } from './__mocks__/dependency.js';

expect(value).toBe(1);

describe('suite', () => {
  it.only('focused', () => {
    expect(value).toBe(1);
  });

  it('duplicate', () => {
    expect(value).toBe(1);
  });

  it('duplicate', () => {
    expect(value).toBe(1);
  });

  it.skip('skipped', () => {
    expect(value).toBe(1);
  });

  // it('commented out', () => {});

  it('without assertion', () => {
    nodeTest();
  });

  it('conditional', () => {
    if (value) {
      expect(value).toBe(1);
    }
  });

  it('snapshot', () => {
    expect(value).toMatchInlineSnapshot(\`\${value}\`);
  });

  it('async wrapper', async () => {
    await expect(async () => await Promise.resolve(value)).rejects.toThrow('value');
  });

  it('called', () => {
    const fn = vi.fn();
    fn();
    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith();
  });

  it.concurrent('concurrent snapshot', () => {
    expect(value).toMatchSnapshot();
  });

  it('dangling expect', () => {
    expect(value);
  });

  it('promise', () => {
    Promise.resolve(value).then((resolved) => {
      expect(resolved).toBe(1);
    });
  });

  it('', () => {
    expect(value).toBe(1);
  });
});

describe('callback with parameters', (parameter) => {
  it('inside', () => {
    expect(parameter).toBe(1);
  });
});
`;

/**
 * Test source that violates the Vitest rules Oxlint's correctness category adds beyond
 * `configs.recommended`.
 */
export const vitestCandidateViolations = `
import { describe, expect, it, vi } from 'vitest';

describe('candidates', () => {
  it('mocks', async () => {
    const fn = vi.fn();
    fn();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(() => {
      throw new Error('failure');
    }).toThrow();
    expect(fn).toMatchSnapshot();
    expect(fn).toMatchSnapshot();
    expect.poll(() => 1).toBe(1);
    await Promise.resolve();
  });

  if (Math.random() > 0.5) {
    it('conditional', () => {
      expect(1).toBe(1);
    });
  }

  it('hoisted', () => {
    if (vi.isMockFunction(expect)) {
      vi.mock('./dependency.js');
    }

    expect(1).toBe(1);
  });

  it.todo('later');
});
`;

export const vitestRecommendedRuleIds = [
  'vitest/expect-expect',
  'vitest/no-commented-out-tests',
  'vitest/no-conditional-expect',
  'vitest/no-disabled-tests',
  'vitest/no-focused-tests',
  'vitest/no-identical-title',
  'vitest/no-import-node-test',
  'vitest/no-interpolation-in-snapshots',
  'vitest/no-mocks-import',
  'vitest/no-standalone-expect',
  'vitest/no-unneeded-async-expect-function',
  'vitest/prefer-called-exactly-once-with',
  'vitest/require-local-test-context-for-concurrent-snapshots',
  'vitest/valid-describe-callback',
  'vitest/valid-expect',
  'vitest/valid-expect-in-promise',
  'vitest/valid-title',
];

export const vitestCandidateRuleIds = [
  'vitest/hoisted-apis-on-top',
  'vitest/no-conditional-tests',
  'vitest/prefer-snapshot-hint',
  'vitest/require-awaited-expect-poll',
  'vitest/require-mock-type-parameters',
  'vitest/require-to-throw-message',
  'vitest/warn-todo',
];

/** Converts an Oxlint diagnostic code such as `vitest(valid-title)` to `vitest/valid-title`. */
export function oxlintCodeToRuleId(code: string): string {
  return code.replace(/^([\w-]+)\((.+)\)$/u, '$1/$2');
}

export const validExpectCases = [
  { code: 'expect(200).toBe(200);', errors: 0 },
  { code: "expect(200, 'response body').toBe(200);", errors: 0 },
  { code: "const message = 'response body'; expect(200, message).toBe(200);", errors: 0 },
  { code: "const message = 'response body'; expect(200, message, message).toBe(200);", errors: 1 },
  { code: 'expect().toBe(200);', errors: 1 },
  { code: 'expect(200);', errors: 1 },
  { code: 'expect(200).toBe;', errors: 1 },
  { code: 'expect(Promise.resolve(200)).resolves.toBe(200);', errors: 1 },
];
