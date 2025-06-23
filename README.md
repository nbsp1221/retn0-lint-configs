# 🧹 retn0-lint-configs

[![gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://gitmoji.dev)

This monorepo provides my custom linting configuration packages for modern JavaScript and TypeScript development.

## Packages

This repository contains two main packages:

- [`@retn0/eslint-config`](./packages/eslint-config): Comprehensive ESLint configuration with code quality and style enforcement.
- [`@retn0/oxlint-config`](./packages/oxlint-config): High-performance Oxlint configuration for fast linting.

## Requirements

> [!NOTE]
> These configurations use the latest linting tools and formats. Make sure you meet the version requirements.

- [Node.js](https://nodejs.org) 22.0.0 or higher
- [ESLint](https://eslint.org) 9.29.0 or higher
- [Oxlint](https://oxc.rs) 1.3.0 or higher (if using Oxlint)
- [TypeScript](https://www.typescriptlang.org) 5.0.0 or higher (if using TypeScript)
- [React](https://react.dev) 19.0.0 or higher (if using React)

## Installation

```sh
# npm
npm install -D eslint oxlint @retn0/eslint-config @retn0/oxlint-config

# pnpm
pnpm add -D eslint oxlint @retn0/eslint-config @retn0/oxlint-config

# yarn
yarn add -D eslint oxlint @retn0/eslint-config @retn0/oxlint-config
```

## Usage

### ESLint Configuration

Create an `eslint.config.js` file in the root of your project:

```js
import { createConfigs } from '@retn0/eslint-config';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...createConfigs({
    // Enable Oxlint integration for better performance (recommended)
    oxlint: true,
  }),

  // Add your custom configurations here
]);
```

You can customize the configuration by passing options to `createConfigs()`. Here are the default values:

```js
...createConfigs({
  js: true,
  ts: true,
  stylistic: true,
  perfectionist: {
    internalPattern: ['^@/.*', '^~/.*'],
  },
  react: true,
  oxlint: false,
})
```

### Oxlint Configuration

Create a `.oxlintrc.json` file in the root of your project:

```json
{
  "extends": ["./node_modules/@retn0/oxlint-config/index.jsonc"]
}
```
