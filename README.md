# 🧹 retn0-lint-configs

[![gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://gitmoji.dev)

Shared linting and formatting presets for use across projects.

## Packages

Choose the packages you need:

- [`@retn0/eslint-config`](./packages/eslint-config): Shared ESLint rules for JavaScript and TypeScript.
- [`@retn0/eslint-config-oxlint`](./packages/eslint-config-oxlint): Disable ESLint rules already covered by the Oxlint preset.
- [`@retn0/oxfmt-config`](./packages/oxfmt-config): Shared formatting preferences.
- [`@retn0/oxlint-config`](./packages/oxlint-config): Shared Oxlint rules with type-aware linting.

## Requirements

> [!NOTE]
> Install only the tools and config packages you use.

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [ESLint](https://eslint.org) 10.x
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) 0.71.x
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) 1.86.x when using the ESLint compatibility package
- [oxlint-tsgolint](https://oxc.rs/docs/guide/usage/linter/type-aware) 7.0.x, version 7.0.2003 or higher
- [TypeScript](https://www.typescriptlang.org) >=4.8.4 <6.1.0 for the ESLint preset

## Getting Started

Follow the installation and usage instructions in each package README linked above.
For ESLint and Oxlint together, use the [ESLint compatibility guide](./packages/eslint-config-oxlint).
