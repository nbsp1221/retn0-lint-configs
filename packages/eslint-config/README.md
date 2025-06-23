# @retn0/eslint-config

[![npm version](https://img.shields.io/npm/v/@retn0/eslint-config)](https://www.npmjs.com/package/@retn0/eslint-config)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/eslint-config)](https://www.npmjs.com/package/@retn0/eslint-config)

Comprehensive ESLint configuration with code quality and style enforcement.

## Requirements

- [Node.js](https://nodejs.org) 22.0.0 or higher
- [ESLint](https://eslint.org) 9.29.0 or higher
- [TypeScript](https://www.typescriptlang.org) 5.0.0 or higher (if using TypeScript)
- [React](https://react.dev) 19.0.0 or higher (if using React)

## Installation

```sh
# npm
npm install -D eslint @retn0/eslint-config

# pnpm
pnpm add -D eslint @retn0/eslint-config

# yarn
yarn add -D eslint @retn0/eslint-config
```

## Usage

Create an `eslint.config.js` file in the root of your project:

```js
import { createConfigs } from '@retn0/eslint-config';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...createConfigs(),

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

## License

MIT © [nbsp1221](https://github.com/nbsp1221)
