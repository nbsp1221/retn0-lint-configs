import type { LintOptions } from '@retn0/common';
import type { OxlintConfig } from 'oxlint';
import { createOxlintConfig } from '@retn0/common';

export type ConfigOptions = LintOptions;

export function createConfig(
  options: ConfigOptions = {},
  ...overrides: OxlintConfig[]
): OxlintConfig {
  return createOxlintConfig(options, ...overrides);
}

export default createConfig;
