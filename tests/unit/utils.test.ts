import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { omitBy } from '../../packages/common/src/utils.js';

describe('omitBy', () => {
  it('filters mixed property values by their type', () => {
    const settings = { retries: 2, label: 'preview', timeout: 45 };

    expect(omitBy(settings, (value) => typeof value === 'string')).toEqual({
      retries: 2,
      timeout: 45,
    });
  });

  it('returns a fresh empty object when every property matches', () => {
    const settings = Object.freeze({ lint: 'off', format: 'off' });
    const result = omitBy(settings, (value) => value === 'off');

    expect(result).toEqual({});
    expect(result).not.toBe(settings);
    expect(settings).toEqual({ lint: 'off', format: 'off' });
  });

  it('returns a fresh object when no property matches', () => {
    const settings = Object.freeze({ lint: 'error', format: 'warn' });
    const result = omitBy(settings, (value) => typeof value === 'string' && value.length === 0);

    expect(result).toEqual(settings);
    expect(result).not.toBe(settings);
  });

  it('does not call the predicate for an empty input', () => {
    const predicate = vi.fn(() => true);

    expect(omitBy({}, predicate)).toEqual({});
    expect(predicate).not.toHaveBeenCalled();
  });

  it('filters root keys without traversing or cloning nested values', () => {
    const settings = {
      rules: { eqeqeq: undefined },
      plugins: ['react'],
      temporary: { enabled: false },
    };
    const result = omitBy(settings, (_value, key) => key === 'temporary');

    expect(result).toEqual({ rules: { eqeqeq: undefined }, plugins: ['react'] });
    expect(result.rules).toBe(settings.rules);
    expect(result.plugins).toBe(settings.plugins);
    expect(settings.temporary).toEqual({ enabled: false });
  });

  it('passes numeric property names as strings', () => {
    const received: Array<[string, unknown]> = [];
    const result = omitBy({ 12: 'off', 48: 'error' }, (value, key) => {
      expectTypeOf(key).toEqualTypeOf<string>();
      received.push([key, value]);
      return value === 'off';
    });

    expect(received).toEqual([
      ['12', 'off'],
      ['48', 'error'],
    ]);
    expect(result).toEqual({ 48: 'error' });
  });

  it('filters number-indexed records using string keys', () => {
    const settings: Record<number, string> = { 10: 'warn', 20: 'error' };
    const result = omitBy(settings, (_value, key) => {
      expectTypeOf(key).toEqualTypeOf<string>();
      return key === '10';
    });

    expect(result).toEqual({ 20: 'error' });
  });

  it('preserves result types without assuming exact input keys or value types', () => {
    const settings = { enabled: true, mode: 'strict' };
    const result = omitBy(settings, (value, key) => {
      expectTypeOf(value).toEqualTypeOf<unknown>();
      expectTypeOf(key).toEqualTypeOf<string>();
      return key === 'mode';
    });

    expectTypeOf(result).toEqualTypeOf<Partial<typeof settings>>();
    expect(result).toEqual({ enabled: true });
  });

  it('handles runtime properties absent from the declared input type', () => {
    const original = { label: 'preview', count: 1 };
    const settings: { label: string } = original;
    const received: unknown[] = [];
    const result = omitBy(settings, (value) => {
      received.push(value);
      return typeof value === 'string' && value.trim() === 'preview';
    });

    expect(received).toEqual(['preview', 1]);
    expect(result).toEqual({ count: 1 });
  });

  it('removes undefined while retaining other falsy values and empty containers', () => {
    const settings = {
      absent: undefined,
      disabled: false,
      count: 0,
      label: '',
      plugin: null,
      rules: {},
      plugins: [],
    };

    expect(omitBy(settings, (value) => value === undefined)).toEqual({
      disabled: false,
      count: 0,
      label: '',
      plugin: null,
      rules: {},
      plugins: [],
    });
  });

  it('visits only own enumerable string properties', () => {
    const metadata = Symbol('metadata');
    const settings = Object.defineProperty({ mode: 'strict', [metadata]: 'internal' }, 'hidden', {
      value: 'internal',
      enumerable: false,
    });
    Object.setPrototypeOf(settings, { inherited: 'internal' });
    const predicate = vi.fn(() => false);

    expect(omitBy(settings, predicate)).toEqual({ mode: 'strict' });
    expect(predicate).toHaveBeenCalledExactlyOnceWith('strict', 'mode');
  });

  it('retains a __proto__ data property without changing the result prototype', () => {
    const settings = { ['__proto__']: { enabled: true }, mode: 'strict' };
    const result = omitBy(settings, () => false);

    expect(Object.hasOwn(result, '__proto__')).toBe(true);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(result).toEqual(settings);
  });
});
