# @retn0/oxfmt-config

[![npm version](https://img.shields.io/npm/v/@retn0/oxfmt-config)](https://www.npmjs.com/package/@retn0/oxfmt-config)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/oxfmt-config)](https://www.npmjs.com/package/@retn0/oxfmt-config)

Shared formatting preferences for Oxfmt.

## Requirements

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) 0.71.x

## Installation

npm 7+ and pnpm install missing tools automatically with their default settings.

```sh
# npm
npm install -D @retn0/oxfmt-config

# pnpm
pnpm add -D @retn0/oxfmt-config
```

<details>
<summary>Yarn</summary>

Install the tools explicitly:

```sh
yarn add -D oxfmt @retn0/oxfmt-config
```

After creating the config below, run `yarn oxfmt --write .`.

</details>

## Usage

Create an `oxfmt.config.ts` file in the root of your project:

```ts
export { default } from '@retn0/oxfmt-config';
```

Format your files:

```sh
npx oxfmt --write .
```

## Customization

Spread the preset and override the settings you need:

```ts
import config from '@retn0/oxfmt-config';

export default {
  ...config,
  sortTailwindcss: {
    functions: ['cn', 'clsx', 'cva'],
  },
};
```

## License

MIT © [nbsp1221](https://github.com/nbsp1221)
