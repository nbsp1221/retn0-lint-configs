import type { Linter } from 'eslint';
import type { RuntimeEnvironment } from './configs/base.js';
import { createBaseConfigs } from './configs/base.js';
import { jsConfigs } from './configs/js.js';
import { perfectionistConfigs } from './configs/perfectionist.js';
import { reactHooksConfigs } from './configs/react-hooks.js';
import { reactConfigs } from './configs/react.js';
import { stylisticConfigs } from './configs/stylistic.js';
import { tsConfigs } from './configs/ts.js';

export type { RuntimeEnvironment };

export type ConfigInput = Linter.Config | Linter.Config[];

export interface ConfigOptions {
  environments?: RuntimeEnvironment[];
  js?: boolean;
  ts?: boolean;
  stylistic?: boolean;
  react?: boolean;
  perfectionist?: boolean;
}

export function createConfig(
  options: ConfigOptions = {},
  ...overrides: ConfigInput[]
): Linter.Config[] {
  const {
    environments = [],
    js = true,
    ts = true,
    stylistic = true,
    react = false,
    perfectionist = false,
  } = options;

  const config = [
    ...createBaseConfigs({ environments }),
    ...(js ? jsConfigs : []),
    ...(ts ? tsConfigs : []),
    ...(stylistic && (js || ts) ? stylisticConfigs : []),
    ...(react ? [...reactConfigs, ...reactHooksConfigs] : []),
    ...(perfectionist ? perfectionistConfigs : []),
    ...overrides.flat(),
  ] as Linter.Config[];

  return config;
}

export default createConfig;
