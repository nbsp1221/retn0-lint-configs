import createConfig, { createConfig as namedCreateConfig } from '@retn0/eslint-config';
import { describe, expect, it } from 'vitest';

describe('eslint config exports', () => {
  it('exports the default factory as the named factory', () => {
    expect(namedCreateConfig).toBe(createConfig);
  });
});
