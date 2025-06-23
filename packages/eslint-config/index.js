import { defineConfig } from 'eslint/config';
import { baseConfigs } from './configs/base.js';
import { jsConfigs } from './configs/js.js';
import { oxlintConfigs } from './configs/oxlint.js';
import { createPerfectionistConfigs } from './configs/perfectionist.js';
import { reactConfigs } from './configs/react.js';
import { stylisticConfigs } from './configs/stylistic.js';
import { tsConfigs } from './configs/ts.js';

export function createConfigs(options = {}) {
  const {
    js = true,
    ts = true,
    stylistic = true,
    perfectionist = {},
    react = true,
    oxlint = false,
  } = options;

  const configs = defineConfig([
    ...baseConfigs,
    ...(js ? jsConfigs : []),
    ...(ts ? tsConfigs : []),
    ...(stylistic ? stylisticConfigs : []),
    ...(perfectionist ? createPerfectionistConfigs(perfectionist) : []),
    ...(react ? reactConfigs : []),
    ...(oxlint ? oxlintConfigs : []),
  ]);

  return configs;
}
