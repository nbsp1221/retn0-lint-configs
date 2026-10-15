import type { OxlintConfig } from 'oxlint';
import { createOxlintConfig } from '@retn0/common';

export function createConfig(...overrides: OxlintConfig[]): OxlintConfig {
  return createOxlintConfig(...overrides);
}

export default createConfig;
