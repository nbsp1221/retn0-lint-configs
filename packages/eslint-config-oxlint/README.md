# @retn0/eslint-config-oxlint

[![npm version](https://img.shields.io/npm/v/@retn0/eslint-config-oxlint)](https://www.npmjs.com/package/@retn0/eslint-config-oxlint)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/eslint-config-oxlint)](https://www.npmjs.com/package/@retn0/eslint-config-oxlint)

Disable ESLint rules already covered by `@retn0/oxlint-config`.
Run Oxlint first, then let ESLint check the remaining rules.

## Requirements

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [ESLint](https://eslint.org) 10.x
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) 1.86.x

Use with [`@retn0/eslint-config`](../eslint-config) and [`@retn0/oxlint-config`](../oxlint-config), which list their additional requirements.

## Installation

```sh
# npm
npm install -D @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config \
  eslint@10 oxlint@1.86 oxlint-tsgolint@~7.0.2003 typescript@6.0

# pnpm
pnpm add -D @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config \
  eslint@10 oxlint@1.86 oxlint-tsgolint@~7.0.2003 typescript@6.0

# yarn
yarn add -D @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config \
  eslint@10 oxlint@1.86 oxlint-tsgolint@~7.0.2003 typescript@6.0
```

## Usage

Create `oxlint.config.ts`:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0();
```

Create `eslint.config.js`, placing the compatibility config after the base preset:

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

Add a lint script to `package.json`:

```json
{
  "scripts": {
    "lint": "oxlint . && eslint ."
  }
}
```

Run both tools:

```sh
npm run lint
```

## License

MIT © [nbsp1221](https://github.com/nbsp1221)
