import config from '@retn0/oxfmt-config';
import { describe, expect, it } from 'vitest';

describe('oxfmt config exports', () => {
  it('exports only the default config object', async () => {
    const module = await import('@retn0/oxfmt-config');

    expect(module.default).toBe(config);
    expect(module).not.toHaveProperty('configs');
    expect(module).not.toHaveProperty('createConfig');
    expect(module).not.toHaveProperty('recommended');
  });
});
