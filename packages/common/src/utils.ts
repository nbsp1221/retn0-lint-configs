/** Filters own enumerable string properties without cloning retained values. */
export function omitBy<T extends object>(
  object: T,
  predicate: (value: unknown, key: string) => boolean,
): Partial<T> {
  const entries: Array<[string, unknown]> = Object.entries(object);

  // Filtering only removes entries; retained properties keep their original types.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return Object.fromEntries(entries.filter(([key, value]) => !predicate(value, key))) as Partial<T>;
}
