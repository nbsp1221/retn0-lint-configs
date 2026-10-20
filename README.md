# 🧹 retn0-lint-configs

[![CI](https://img.shields.io/github/actions/workflow/status/nbsp1221/retn0-lint-configs/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/nbsp1221/retn0-lint-configs/actions/workflows/ci.yml)
[![gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://gitmoji.dev)

This monorepo provides my personal linting and formatting configuration packages.

## Getting Started

### Oxlint + ESLint (recommended)

Use Oxlint for the rules it supports and ESLint for the remaining rules. The compatibility config disables overlapping ESLint rules.

```sh
npm install -D eslint oxlint oxlint-tsgolint @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config
```

Create `oxlint.config.mts`:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0();
```

Create `eslint.config.mjs`:

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

Include your TypeScript source and config files in `tsconfig.json`, then run:

```sh
npx oxlint . && npx eslint .
```

See the [combined setup guide](./packages/eslint-config-oxlint) for pnpm, Yarn, and tool requirements.

### Use one linter

- [Oxlint only](./packages/oxlint-config): Use the Oxlint preset without ESLint.
- [ESLint only](./packages/eslint-config): Use the ESLint preset without Oxlint or the compatibility config.

Each setup runs a different set of rules. The presets share the `js`, `ts`, `react`, and `vitest` feature options, not their native configuration formats. JavaScript and TypeScript are enabled by default; React and Vitest are opt-in. Pass the same feature choices to the compatibility factory when running both linters.

### Formatting

[Oxfmt](./packages/oxfmt-config) can be used with any of these linting setups.

## Packages

This repository contains four public packages:

- [`@retn0/eslint-config`](./packages/eslint-config): My personal ESLint configuration.
- [`@retn0/eslint-config-oxlint`](./packages/eslint-config-oxlint): My personal ESLint compatibility configuration for `@retn0/oxlint-config`.
- [`@retn0/oxfmt-config`](./packages/oxfmt-config): My personal Oxfmt configuration.
- [`@retn0/oxlint-config`](./packages/oxlint-config): My personal Oxlint configuration.

## Requirements

> [!NOTE]
> Install only the tools and config packages you use.

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [ESLint](https://eslint.org) 10.x
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) 0.72.x
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) 1.87.x when using the ESLint compatibility package
- [oxlint-tsgolint](https://oxc.rs/docs/guide/usage/linter/type-aware) 7.0.2003 or higher
