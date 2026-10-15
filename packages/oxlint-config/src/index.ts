import type { OxlintConfig } from 'oxlint';
import { createOxlintConfig } from '@retn0/common';

export interface ConfigOptions {
  /**
   * Enable Vitest rules and globals for test files.
   *
   * @default false
   */
  vitest?: boolean;
}

export function createConfig(options: ConfigOptions, ...overrides: OxlintConfig[]): OxlintConfig;
export function createConfig(...overrides: OxlintConfig[]): OxlintConfig;

export function createConfig(...args: Array<ConfigOptions | OxlintConfig>): OxlintConfig {
  // The shared factory validates options placement before treating remaining arguments as overrides.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return createOxlintConfig(...(args as [ConfigOptions, ...OxlintConfig[]]));
}

export default createConfig;
