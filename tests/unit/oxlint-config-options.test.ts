import { createOxlintConfig, testFilePatterns } from '@retn0/common';
import { describe, expect, it } from 'vitest';

describe('oxlint config options', () => {
  it('keeps the override-only call signature unchanged', () => {
    const config = createOxlintConfig({ rules: { 'no-console': 'warn' } }, { plugins: ['jest'] });

    expect(config.rules).toMatchObject({ 'no-console': 'warn' });
    expect(config.plugins).toEqual(['oxc', 'react', 'typescript', 'unicorn', 'jest']);
    expect(createOxlintConfig({})).toEqual(createOxlintConfig());
  });

  it('does not enable Vitest by default', () => {
    for (const config of [createOxlintConfig(), createOxlintConfig({ vitest: false })]) {
      expect(config.plugins).not.toContain('vitest');
      expect(JSON.stringify(config)).not.toContain('vitest');
    }
  });

  it('adds one test-file override with the Vitest plugin, globals, and rules', () => {
    const base = createOxlintConfig();
    const config = createOxlintConfig({ vitest: true });
    const vitestOverride = config.overrides?.at(-1);

    expect(config.plugins).toEqual(base.plugins);
    expect(config.overrides).toHaveLength((base.overrides?.length ?? 0) + 1);
    expect(config.overrides?.slice(0, -1)).toEqual(base.overrides);
    expect(vitestOverride).toMatchObject({
      files: testFilePatterns,
      plugins: ['vitest'],
      env: { vitest: true },
    });
    expect(vitestOverride?.rules).toMatchObject({
      'vitest/no-disabled-tests': 'warn',
      'vitest/no-focused-tests': 'error',
      'vitest/require-mock-type-parameters': 'off',
    });
  });

  it('applies overrides after options', () => {
    const config = createOxlintConfig(
      { vitest: true },
      { ignorePatterns: ['generated/**'] },
      { rules: { 'no-console': 'warn' } },
    );

    expect(config.ignorePatterns).toContain('generated/**');
    expect(config.rules).toMatchObject({ 'no-console': 'warn' });
    expect(config.overrides?.at(-1)?.plugins).toEqual(['vitest']);
  });

  it('rejects options mixed into Oxlint config fields', () => {
    expect(() =>
      // Deliberately exercise an invalid JavaScript call that TypeScript rejects.
      // @ts-expect-error Options and config fields must be separate arguments.
      createOxlintConfig({ vitest: true, rules: {} }),
    ).toThrow('cannot be mixed with Oxlint config fields');
    expect(() =>
      // Deliberately exercise an invalid JavaScript call that TypeScript rejects.
      // @ts-expect-error Options must precede config overrides.
      createOxlintConfig({}, { vitest: true }),
    ).toThrow('must be passed as the first argument');
  });
});
