# @retn0/eslint-config-oxlint

[![npm version](https://img.shields.io/npm/v/@retn0/eslint-config-oxlint)](https://www.npmjs.com/package/@retn0/eslint-config-oxlint)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/eslint-config-oxlint)](https://www.npmjs.com/package/@retn0/eslint-config-oxlint)

My personal ESLint compatibility configuration for `@retn0/oxlint-config`.

## Requirements

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [ESLint](https://eslint.org) 10.x
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) 1.71.0 or higher
- [oxlint-tsgolint](https://oxc.rs/docs/guide/usage/linter/type-aware) 0.23.x

## Installation

```sh
# npm
npm install -D eslint oxlint oxlint-tsgolint @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config

# pnpm
pnpm add -D eslint oxlint oxlint-tsgolint @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config

# yarn
yarn add -D eslint oxlint oxlint-tsgolint @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config
```

## Usage

Run Oxlint with `@retn0/oxlint-config` before ESLint, then append this config
after the base ESLint config:

```ts
import config from '@retn0/oxlint-config';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [config],
});
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

Then run both tools:

```json
{
  "scripts": {
    "lint": "oxlint . && eslint ."
  }
}
```

## License

MIT © [nbsp1221](https://github.com/nbsp1221)
