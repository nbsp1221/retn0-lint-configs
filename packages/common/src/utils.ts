export type ObjectKeys<T> = Extract<keyof T, string> | `${Extract<keyof T, number>}`;

/**
 * Filters own enumerable string properties without cloning retained values.
 */
export function omitBy<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: ObjectKeys<T>) => boolean,
): Partial<T> {
  const result = { ...obj };

  for (const key in result) {
    if (Object.hasOwn(result, key) && predicate(result[key], key)) {
      delete result[key];
    }
  }

  for (const key of Object.getOwnPropertySymbols(result)) {
    Reflect.deleteProperty(result, key);
  }

  return result;
}
