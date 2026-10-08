# @retn0/eslint-config-oxlint

[![npm version](https://img.shields.io/npm/v/@retn0/eslint-config-oxlint)](https://www.npmjs.com/package/@retn0/eslint-config-oxlint)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/eslint-config-oxlint)](https://www.npmjs.com/package/@retn0/eslint-config-oxlint)

My personal ESLint compatibility configuration for `@retn0/oxlint-config`.

## Requirements

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [ESLint](https://eslint.org) 10.x
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) 1.86.x, matching the bundled eslint-plugin-oxlint version
- [oxlint-tsgolint](https://oxc.rs/docs/guide/usage/linter/type-aware) 7.0.x, version 7.0.2003 or higher
- [TypeScript](https://www.typescriptlang.org) >=4.8.4 <6.1.0 when using @retn0/eslint-config; verified with 6.0.3

## Installation

```sh
# npm
npm install -D eslint@^10.0.0 oxlint@~1.86.0 oxlint-tsgolint@~7.0.2003 typescript@~6.0.3 @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config

# pnpm
pnpm add -D eslint@^10.0.0 oxlint@~1.86.0 oxlint-tsgolint@~7.0.2003 typescript@~6.0.3 @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config

# yarn
yarn add -D eslint@^10.0.0 oxlint@~1.86.0 oxlint-tsgolint@~7.0.2003 typescript@~6.0.3 @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config
```

## Usage

Run Oxlint with `@retn0/oxlint-config` before ESLint, then append this config
after the base ESLint config:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0();
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
