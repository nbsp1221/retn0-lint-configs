# @retn0/oxfmt-config

[![npm version](https://img.shields.io/npm/v/@retn0/oxfmt-config)](https://www.npmjs.com/package/@retn0/oxfmt-config)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/oxfmt-config)](https://www.npmjs.com/package/@retn0/oxfmt-config)

My personal Oxfmt configuration.

## Requirements

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) 0.56.x

## Installation

```sh
# npm
npm install -D oxfmt @retn0/oxfmt-config

# pnpm
pnpm add -D oxfmt @retn0/oxfmt-config

# yarn
yarn add -D oxfmt @retn0/oxfmt-config
```

## Usage

Create an `oxfmt.config.ts` file in the root of your project:

```ts
import config from '@retn0/oxfmt-config';
import { defineConfig } from 'oxfmt';

export default defineConfig(config);
```

Spread the shared config when you need local overrides:

```ts
import config from '@retn0/oxfmt-config';
import { defineConfig } from 'oxfmt';

export default defineConfig({
  ...config,
  sortTailwindcss: {
    functions: ['cn', 'clsx', 'cva'],
  },
});
```

## License

MIT © [nbsp1221](https://github.com/nbsp1221)
