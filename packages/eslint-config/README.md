# @retn0/eslint-config

[![npm version](https://img.shields.io/npm/v/@retn0/eslint-config)](https://www.npmjs.com/package/@retn0/eslint-config)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/eslint-config)](https://www.npmjs.com/package/@retn0/eslint-config)

My personal ESLint configuration.

## Requirements

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [ESLint](https://eslint.org) 10.x

## Installation

```sh
# npm
npm install -D eslint @retn0/eslint-config

# pnpm
pnpm add -D eslint @retn0/eslint-config

# yarn
yarn add -D eslint typescript@6 @retn0/eslint-config
```

## Usage

Create an `eslint.config.mjs` file in the root of your project:

```js
import retn0 from '@retn0/eslint-config';

export default retn0({
  environments: ['node'],
});
```

TypeScript files must be included in your `tsconfig.json`.

Pass options to the default factory when needed:

```js
export default retn0({
  environments: [],
  js: true,
  ts: true,
  stylistic: true,
  react: false,
  perfectionist: false,
  vitest: false,
});
```

Runtime environments are opt-in:

```js
export default retn0({
  environments: ['browser', 'vitest'],
  react: true,
});
```

## Vitest

Enable Vitest linting explicitly:

```js
import retn0 from '@retn0/eslint-config';

export default retn0({
  environments: ['node'],
  vitest: true,
});
```

`vitest` defaults to `false`. When enabled, the preset applies the 17 recommended rules from the pinned `@vitest/eslint-plugin` version, preserving their severities (`no-disabled-tests` is a warning; the others are errors). The rule definitions are shared with `@retn0/oxlint-config`. Native rule implementations can still produce different diagnostics on some code.

Rules and Vitest globals apply only to `**/*.{test,spec}.{js,mjs,cjs,jsx,ts,mts,cts,tsx}`. This does not include helpers, config files, or files named only by their `__tests__` directory. It also matches Playwright and Bun test filenames; use local exclusions or scoped rule overrides when mixing test runners.

Prefer explicit imports from `vitest`. If using globals in TypeScript, include `vitest/globals` in the appropriate test tsconfig: lint globals do not provide TypeScript types. The existing `environments: ['vitest']` option still declares globals for all JS/TS files; it does not enable Vitest rules. Use `vitest: true` for scoped rules and globals.

When also running Oxlint, use the opt-in factory in [`@retn0/eslint-config-oxlint`](../eslint-config-oxlint#vitest) to avoid duplicate Vitest diagnostics.

User overrides are appended after the shared config:

```js
export default retn0(
  {
    environments: ['node'],
  },
  {
    rules: {
      'no-console': 'warn',
    },
  },
);
```

## License

MIT © [nbsp1221](https://github.com/nbsp1221)
