# @retn0/oxlint-config

[![npm version](https://img.shields.io/npm/v/@retn0/oxlint-config)](https://www.npmjs.com/package/@retn0/oxlint-config)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/oxlint-config)](https://www.npmjs.com/package/@retn0/oxlint-config)

Shared Oxlint rules with type-aware linting enabled by default.

## Requirements

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) 1.x, version 1.86.0 or higher
- [oxlint-tsgolint](https://oxc.rs/docs/guide/usage/linter/type-aware) 7.0.x, version 7.0.2003 or higher

## Installation

npm 7+ and pnpm install missing tools automatically with their default settings. Existing tool versions must satisfy the requirements above.

```sh
# npm
npm install -D @retn0/oxlint-config

# pnpm
pnpm add -D @retn0/oxlint-config
```

<details>
<summary>Yarn</summary>

For type-aware linting, use `nodeLinker: node-modules` in `.yarnrc.yml`. Install the tools explicitly with compatible versions:

```sh
yarn add -D oxlint@1 oxlint-tsgolint@7.0 @retn0/oxlint-config
```

After creating the config below, run `yarn oxlint .`.

</details>

## Usage

Create an `oxlint.config.ts` file in the root of your project:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0();
```

Run Oxlint:

```sh
npx oxlint .
```

## Customization

Pass your own settings to override the preset:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0({
  ignorePatterns: ['generated/**'],
  rules: {
    'no-console': 'warn',
  },
});
```

## License

MIT © [nbsp1221](https://github.com/nbsp1221)
