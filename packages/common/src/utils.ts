export type ObjectKeys<T> = Extract<keyof T, string> | `${Extract<keyof T, number>}`;

/**
 * Captures own enumerable string properties before filtering without cloning retained values.
 */
export function omitBy<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: ObjectKeys<T>) => boolean,
): Partial<T> {
  const entries: Array<[ObjectKeys<T>, T[keyof T]]> = [];

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      entries.push([key, obj[key]]);
    }
  }

  const result: Partial<T> = {};

  for (const [key, value] of entries) {
    if (!predicate(value, key)) {
      // Define data properties so "__proto__" remains an ordinary key.
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
