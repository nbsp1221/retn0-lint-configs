# @retn0/eslint-config-oxlint

[![npm version](https://img.shields.io/npm/v/@retn0/eslint-config-oxlint)](https://www.npmjs.com/package/@retn0/eslint-config-oxlint)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/eslint-config-oxlint)](https://www.npmjs.com/package/@retn0/eslint-config-oxlint)

My personal ESLint compatibility configuration for `@retn0/oxlint-config`.

## Requirements

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [ESLint](https://eslint.org) 10.x
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) 1.87.x
- [oxlint-tsgolint](https://oxc.rs/docs/guide/usage/linter/type-aware) 7.0.2003 or higher

## Installation

```sh
# npm
npm install -D eslint oxlint oxlint-tsgolint @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config

# pnpm
pnpm add -D eslint oxlint oxlint-tsgolint @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config

# yarn
yarn add -D eslint oxlint oxlint-tsgolint typescript@6 @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config
```

For type-aware linting with Yarn, use `nodeLinker: node-modules` in `.yarnrc.yml`.

## Usage

Create `oxlint.config.mts`:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0();
```

Create `eslint.config.mjs` and append the compatibility config after the base config:

```js
import retn0 from '@retn0/eslint-config';
import eslintConfigOxlint from '@retn0/eslint-config-oxlint';

export default retn0(
  {
    environments: ['node'],
  },
  eslintConfigOxlint,
);
```

Include your TypeScript source and config files in `tsconfig.json`.

Then run both tools:

```json
{
  "scripts": {
    "lint": "oxlint . && eslint ."
  }
}
```

## Vitest

The setup above runs recommended Vitest rules through [Oxlint](../oxlint-config#vitest) and disables overlapping ESLint rules.

With explicit imports from `vitest`, no additional setup is needed. If using globals, enable [ESLint's `vitest` option](../eslint-config#vitest) to declare them for test files.

The presets share rule IDs and severities, but native Oxlint diagnostics can differ from the ESLint plugin's diagnostics.

## License

MIT © [nbsp1221](https://github.com/nbsp1221)
