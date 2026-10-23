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

Run ESLint:

```sh
npx eslint .
```

## Configuration

The default options are:

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

- `js`: Enable JavaScript rules.
- `ts`: Enable TypeScript rules. Setting this to `false` does not exclude TypeScript files from linting.
- `stylistic`: Enable code-style rules when JavaScript or TypeScript rules are enabled.
- `react`: Enable React and React Hooks rules.
- `perfectionist`: Enable sorting rules.
- `vitest`: Enable Vitest rules and globals for test files.
- `environments`: Declare globals for the selected runtime environments.

Runtime environments are opt-in:

```js
export default retn0({
  environments: ['browser'],
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
