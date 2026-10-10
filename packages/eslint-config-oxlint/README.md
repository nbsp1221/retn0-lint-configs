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

npm 7+ and pnpm install missing tools automatically with their default settings.

```sh
# npm
npm install -D @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config

# pnpm
pnpm add -D @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config
```

<details>
<summary>Yarn</summary>

For type-aware linting, use `nodeLinker: node-modules` in `.yarnrc.yml`. Install the tools explicitly:

```sh
yarn add -D @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config \
  eslint oxlint oxlint-tsgolint typescript@6
```

After creating the config below, run `yarn lint`.

</details>

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

Include `oxlint.config.ts` and your TypeScript source files in `tsconfig.json`.

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
