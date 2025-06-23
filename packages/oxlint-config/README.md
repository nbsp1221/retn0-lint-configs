# @retn0/oxlint-config

[![npm version](https://img.shields.io/npm/v/@retn0/oxlint-config)](https://www.npmjs.com/package/@retn0/oxlint-config)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/oxlint-config)](https://www.npmjs.com/package/@retn0/oxlint-config)

High-performance Oxlint configuration for fast linting.

## Requirements

- [Node.js](https://nodejs.org) 22.0.0 or higher
- [Oxlint](https://oxc.rs) 1.3.0 or higher

## Installation

```sh
# npm
npm install -D oxlint @retn0/oxlint-config

# pnpm
pnpm add -D oxlint @retn0/oxlint-config

# yarn
yarn add -D oxlint @retn0/oxlint-config
```

## Usage

Create a `.oxlintrc.json` file in the root of your project:

```json
{
  "extends": ["./node_modules/@retn0/oxlint-config/index.jsonc"]
}
```

## License

MIT © [nbsp1221](https://github.com/nbsp1221)
