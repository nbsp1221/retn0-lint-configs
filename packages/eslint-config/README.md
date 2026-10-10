# @retn0/eslint-config

[![npm version](https://img.shields.io/npm/v/@retn0/eslint-config)](https://www.npmjs.com/package/@retn0/eslint-config)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/eslint-config)](https://www.npmjs.com/package/@retn0/eslint-config)

Shared ESLint rules for JavaScript and TypeScript, with optional React support.

## Requirements

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [ESLint](https://eslint.org) 10.x
- [TypeScript](https://www.typescriptlang.org) >=4.8.4 <6.1.0

## Installation

npm 7+ and pnpm install missing tools automatically with their default settings. Existing tool versions must satisfy the requirements above.

```sh
# npm
npm install -D @retn0/eslint-config

# pnpm
pnpm add -D @retn0/eslint-config
```

<details>
<summary>Yarn</summary>

Install the tools explicitly with compatible versions:

```sh
yarn add -D eslint@10 typescript@6.0 @retn0/eslint-config
```

After creating the config below, run `yarn eslint .`.

</details>

## Usage

Create an `eslint.config.js` file in the root of your project:

```js
import retn0 from '@retn0/eslint-config';

export default retn0({
  environments: ['node'],
});
```

TypeScript files must be included in your `tsconfig.json`.

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
