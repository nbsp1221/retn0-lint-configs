import type { OxlintConfig } from 'oxlint';
import { omitBy } from 'es-toolkit/object';
import { isUndefined } from 'es-toolkit/predicate';

function mergeArray<T>(base: T[] | undefined, override: T[] | undefined): T[] | undefined {
  if (base === undefined && override === undefined) {
    return undefined;
  }

  return [...new Set([...(base ?? []), ...(override ?? [])])];
}

function mergeObject<T extends object>(
  base: T | undefined,
  override: T | undefined,
): T | undefined {
  if (base === undefined && override === undefined) {
    return undefined;
  }

  return {
    ...base,
    ...override,
  } as T;
}

function mergeJsPlugins(
  base: OxlintConfig['jsPlugins'],
  override: OxlintConfig['jsPlugins'],
): OxlintConfig['jsPlugins'] | undefined {
  if (override === null || (override === undefined && base === null)) {
    return null;
  }

  return mergeArray(base ?? undefined, override ?? undefined);
}

function mergeOverrides(
  base: OxlintConfig['overrides'],
  override: OxlintConfig['overrides'],
): OxlintConfig['overrides'] | undefined {
  if (base === undefined && override === undefined) {
    return undefined;
  }

  return [...(base ?? []), ...(override ?? [])];
}

function mergeOxlintConfig(base: OxlintConfig, override: OxlintConfig): OxlintConfig {
  return omitBy(
    {
      ...base,
      ...override,
      categories: mergeObject(base.categories, override.categories),
      env: mergeObject(base.env, override.env),
      globals: mergeObject(base.globals, override.globals),
      ignorePatterns: mergeArray(base.ignorePatterns, override.ignorePatterns),
      jsPlugins: mergeJsPlugins(base.jsPlugins, override.jsPlugins),
      options: mergeObject(base.options, override.options),
      overrides: mergeOverrides(base.overrides, override.overrides),
      plugins: mergeArray(base.plugins, override.plugins),
      rules: mergeObject(base.rules, override.rules),
      settings: mergeObject(base.settings, override.settings),
    },
    isUndefined,
  ) satisfies OxlintConfig;
}

export function mergeOxlintConfigs(base: OxlintConfig, ...overrides: OxlintConfig[]): OxlintConfig {
  return overrides.reduce<OxlintConfig>(
    (config, override) => mergeOxlintConfig(config, override),
    base,
  );
}
