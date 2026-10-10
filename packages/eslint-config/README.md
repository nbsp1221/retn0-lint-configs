# @retn0/eslint-config

[![npm version](https://img.shields.io/npm/v/@retn0/eslint-config)](https://www.npmjs.com/package/@retn0/eslint-config)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/eslint-config)](https://www.npmjs.com/package/@retn0/eslint-config)

Shared ESLint rules for JavaScript and TypeScript, with optional React support.

## Requirements

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [ESLint](https://eslint.org) 10.x
- [TypeScript](https://www.typescriptlang.org) >=4.8.4 <6.1.0

## Installation

```sh
# npm
npm install -D eslint@10 typescript@6.0 @retn0/eslint-config

# pnpm
pnpm add -D eslint@10 typescript@6.0 @retn0/eslint-config

# yarn
yarn add -D eslint@10 typescript@6.0 @retn0/eslint-config
```

## Usage

Create an `eslint.config.js` file in the root of your project:

```js
import retn0 from '@retn0/eslint-config';

export default retn0({
  environments: ['node'],
});
```

Run ESLint:

```sh
npx eslint .
```

## Customization

These are the default options:

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

Choose runtime environments and enable React when needed:

```js
export default retn0({
  environments: ['browser', 'vitest'],
  react: true,
});
```

Pass your own rules after the preset options:

```js
export default retn0(
  {
    environments: ['node'],
  },
  {
    rules: {
      'no-console': 'warn',
    },
  },
);
```

## License

MIT © [nbsp1221](https://github.com/nbsp1221)
