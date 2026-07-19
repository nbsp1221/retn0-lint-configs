# @retn0/eslint-config

[![npm version](https://img.shields.io/npm/v/@retn0/eslint-config)](https://www.npmjs.com/package/@retn0/eslint-config)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/eslint-config)](https://www.npmjs.com/package/@retn0/eslint-config)

My personal ESLint configuration.

## Requirements

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [ESLint](https://eslint.org) 10.x

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
import retn0 from '@retn0/eslint-config';

export default retn0({
  environments: ['node'],
});
```

Pass options to the default factory when needed:

```js
export default retn0({
  environments: [],
  javascript: true,
  typescript: true,
  stylistic: true,
  react: false,
  perfectionist: false,
});
```

Runtime environments are opt-in:

```js
export default retn0({
  environments: ['browser', 'vitest'],
  react: true,
});
```

User overrides are appended after the shared config:

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
