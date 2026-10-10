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

## Getting Started

Follow the installation and usage instructions in each package README linked above.
For ESLint and Oxlint together, use the [ESLint compatibility guide](./packages/eslint-config-oxlint).
