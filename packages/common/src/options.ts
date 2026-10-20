export interface LintOptions {
  js?: boolean;
  ts?: boolean;
  react?: boolean;
  vitest?: boolean;
}

export function resolveLintOptions(options: LintOptions = {}): Required<LintOptions> {
  const { js = true, ts = true, react = false, vitest = false } = options;

  return { js, ts, react, vitest };
}
