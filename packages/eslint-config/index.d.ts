import type { Linter } from 'eslint';

export interface PerfectionistOptions {
  internalPattern?: string[];
}

export interface CreateConfigsOptions {
  js?: boolean;
  ts?: boolean;
  stylistic?: boolean;
  perfectionist?: PerfectionistOptions | false;
  react?: boolean;
  oxlint?: boolean;
}

export function createConfigs(options?: CreateConfigsOptions): Linter.Config[];
