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

## Vitest

Enable recommended Vitest rules and globals with `vitest: true` (default: `false`):

```js
import retn0 from '@retn0/eslint-config';

export default retn0({
  environments: ['node'],
  vitest: true,
});
```

Rules and globals apply only to `**/*.{test,spec}.{js,mjs,cjs,jsx,ts,mts,cts,tsx}`. Files named only by their `__tests__` directory are not included. Use scoped rule overrides when mixing test runners.

Prefer explicit imports from `vitest`. If using globals in TypeScript, add `vitest/globals` to the test tsconfig. The `environments: ['vitest']` option declares globals for all JS/TS files without enabling Vitest rules.

When also running Oxlint, use [`@retn0/eslint-config-oxlint`](../eslint-config-oxlint#vitest) to avoid duplicate diagnostics.

## License

MIT © [nbsp1221](https://github.com/nbsp1221)
