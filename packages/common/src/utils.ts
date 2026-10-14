export type ObjectKeys<T> = Extract<keyof T, string> | `${Extract<keyof T, number>}`;

/**
 * Captures own enumerable string properties before filtering without cloning retained values.
 */
export function omitBy<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: ObjectKeys<T>) => boolean,
): Partial<T> {
  // Config callers only compare values with undefined; runtime keys may exceed keyof T.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const entries = Object.entries(obj) as Array<[ObjectKeys<T>, T[keyof T]]>;

  // Filtering removes properties without changing retained values.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return Object.fromEntries(entries.filter(([key, value]) => !predicate(value, key))) as Partial<T>;
}
