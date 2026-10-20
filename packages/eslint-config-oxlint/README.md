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
  eslintConfigOxlint(),
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

## Feature selection

This package exports a factory, not a config array. Pass the same `js`, `ts`, `react`, and `vitest` choices used by the Oxlint preset. Defaults are `js: true`, `ts: true`, `react: false`, and `vitest: false`.

For React and Vitest, use `retn0({ react: true, vitest: true })` in your Oxlint config. In your ESLint config:

```js
export default retn0(
  { environments: ['node'], react: true, vitest: true },
  eslintConfigOxlint({ react: true, vitest: true }),
);
```

The compatibility layer disables overlapping rules for the selected preset features, including the preset's shared rule preferences. It does not inspect your Oxlint config file or synchronize native overrides. Keep project-specific changes in each tool's native configuration. Put explicit ESLint rule overrides after the compatibility config when a check should remain in ESLint.

## Vitest

With `vitest: true`, recommended Vitest rules run through [Oxlint](../oxlint-config#vitest), and overlapping ESLint rules are disabled only on matching test files. Enable ESLint's `vitest` option as well when using Vitest globals. Explicit imports need no global declarations.

The presets share rule IDs and severities, but native Oxlint diagnostics can differ from the ESLint plugin's diagnostics.

## Migration

Replace the old default config array with a factory call: `eslintConfigOxlint()` for the default features, or `eslintConfigOxlint({ react: true, vitest: true })` to match an Oxlint preset with those integrations enabled.

## License

MIT © [nbsp1221](https://github.com/nbsp1221)
