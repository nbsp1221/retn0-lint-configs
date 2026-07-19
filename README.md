# 🧹 retn0-lint-configs

[![gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://gitmoji.dev)

This monorepo provides my personal linting and formatting configuration packages.

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
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) 0.56.x
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) 1.73.x
- [oxlint-tsgolint](https://oxc.rs/docs/guide/usage/linter/type-aware) 0.25.x

## Installation

```sh
# npm
npm install -D eslint oxfmt oxlint oxlint-tsgolint @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxfmt-config @retn0/oxlint-config

# pnpm
pnpm add -D eslint oxfmt oxlint oxlint-tsgolint @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxfmt-config @retn0/oxlint-config

# yarn
yarn add -D eslint oxfmt oxlint oxlint-tsgolint @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxfmt-config @retn0/oxlint-config
```

## Usage

### ESLint Configuration

Create an `eslint.config.js` file in the root of your project:

```js
import retn0 from '@retn0/eslint-config';

export default retn0({
  environments: ['node'],
});
```

Pass options to the default factory when needed:

```js
export default retn0({
  environments: [],
  js: true,
  ts: true,
  stylistic: true,
  react: false,
  perfectionist: false,
});
```

### ESLint Compatibility for Oxlint

If you run Oxlint before ESLint, use `@retn0/oxlint-config` for Oxlint and
append `@retn0/eslint-config-oxlint` after the base ESLint config:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0();
```

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

### Oxlint Configuration

This preset creates a complete Oxlint config and enables type-aware linting by default.

Create an `oxlint.config.ts` file in the root of your project:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0();
```

### Oxfmt Configuration

Create an `oxfmt.config.ts` file in the root of your project:

```ts
import config from '@retn0/oxfmt-config';
import { defineConfig } from 'oxfmt';

export default defineConfig(config);
```
