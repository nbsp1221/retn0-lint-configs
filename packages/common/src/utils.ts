/** Filters own enumerable string properties without cloning retained values. */
export function omitBy<T extends object>(
  object: T,
  predicate: (value: unknown, key: string) => boolean,
): Partial<T> {
  const entries: Array<[string, unknown]> = Object.entries(object);
  const result: Partial<T> = {};

  for (const [key, value] of entries) {
    if (!predicate(value, key)) {
      Object.defineProperty(result, key, {
        value,
        configurable: true,
        enumerable: true,
        writable: true,
      });
    }
  }

  return result;
}
