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
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) 0.71.x
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) 1.86.x when using the ESLint compatibility package
- [oxlint-tsgolint](https://oxc.rs/docs/guide/usage/linter/type-aware) 7.0.x, version 7.0.2003 or higher
- [TypeScript](https://www.typescriptlang.org) >=4.8.4 <6.1.0 for the ESLint preset; verified with 6.0.3

## Installation

```sh
# npm
npm install -D eslint@^10.0.0 oxfmt@~0.71.0 oxlint@~1.86.0 oxlint-tsgolint@~7.0.2003 typescript@~6.0.3 @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxfmt-config @retn0/oxlint-config

# pnpm
pnpm add -D eslint@^10.0.0 oxfmt@~0.71.0 oxlint@~1.86.0 oxlint-tsgolint@~7.0.2003 typescript@~6.0.3 @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxfmt-config @retn0/oxlint-config

# yarn
yarn add -D eslint@^10.0.0 oxfmt@~0.71.0 oxlint@~1.86.0 oxlint-tsgolint@~7.0.2003 typescript@~6.0.3 @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxfmt-config @retn0/oxlint-config
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

## Development

Repository development requires Node.js 24.x (24.11.0 or higher) or 26.0.0 or higher, and pnpm 12.8.2. The published presets retain their Node.js 24.0.0 minimum.

```sh
pnpm install --frozen-lockfile
pnpm check
```

The workspace rejects releases less than seven days old, fails on peer dependency conflicts and unreviewed dependency build scripts, and checks for publication trust downgrades. The publication-trust exception applies only to the unchanged `semver@6.3.1` backport required by Babel.
