# @retn0/oxlint-config

[![npm version](https://img.shields.io/npm/v/@retn0/oxlint-config)](https://www.npmjs.com/package/@retn0/oxlint-config)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/oxlint-config)](https://www.npmjs.com/package/@retn0/oxlint-config)

My personal Oxlint configuration.

## Requirements

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) 1.x, version 1.86.0 or higher
- [oxlint-tsgolint](https://oxc.rs/docs/guide/usage/linter/type-aware) 7.0.2003 or higher

## Installation

```sh
# npm
npm install -D oxlint oxlint-tsgolint @retn0/oxlint-config

# pnpm
pnpm add -D oxlint oxlint-tsgolint @retn0/oxlint-config

# yarn
yarn add -D oxlint oxlint-tsgolint @retn0/oxlint-config
```

For type-aware linting with Yarn, use `nodeLinker: node-modules` in `.yarnrc.yml`.

## Usage

This preset creates a complete Oxlint config and enables type-aware linting by default.

Create an `oxlint.config.mts` file in the root of your project:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0();
```

Add local overrides after the shared preset:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0({
  ignorePatterns: ['generated/**'],
  rules: {
    'no-console': 'warn',
  },
});
```

## Vitest

Vitest linting is enabled by default on test files, like the preset's existing JavaScript, TypeScript, and React rules. Continue to use the existing override-only factory:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0({ ignorePatterns: ['generated/**'] });
```

There is no separate Vitest options argument. Existing `retn0(...overrides)` calls continue to work, including `retn0({})`. Existing JavaScript, TypeScript, and React behavior is unchanged.

The native Vitest plugin applies the same 17 recommended rules and severities as `@retn0/eslint-config` to `**/*.{test,spec}.{js,mjs,cjs,jsx,ts,mts,cts,tsx}`. Seven additional rules normally enabled by Oxlint's correctness category are explicitly off, so the preset matches ESLint's recommended rule set. Native rule implementations can still produce different diagnostics on some code.

Vitest globals are scoped to the same test files. For TypeScript globals, add `vitest/globals` to the appropriate test tsconfig or use explicit imports. Helpers, config files, and filenames without `.test.` or `.spec.` are outside the scope. The filename pattern also matches other runners such as Playwright and Bun; apply consumer exclusions or overrides as appropriate.

When overriding scoped Vitest rules, include the plugin in that override. Oxlint does not inherit it from an earlier override:

```ts
export default retn0({
  overrides: [
    {
      files: ['**/*.test.ts'],
      plugins: ['vitest'],
      rules: { 'vitest/no-disabled-tests': 'error' },
    },
  ],
});
```

When also running ESLint, append the existing default config array from [`@retn0/eslint-config-oxlint`](../eslint-config-oxlint#vitest).

## License

MIT © [nbsp1221](https://github.com/nbsp1221)
