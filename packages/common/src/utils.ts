/** Filters own enumerable string properties without cloning retained values. */
export function omitBy<T extends object>(
  object: T,
  predicate: (value: T[keyof T], key: `${Exclude<keyof T, symbol>}`) => boolean,
): Partial<T> {
  const entries = Object.entries(object) as Array<[`${Exclude<keyof T, symbol>}`, T[keyof T]]>;

  return Object.fromEntries(entries.filter(([key, value]) => !predicate(value, key))) as Partial<T>;
}
