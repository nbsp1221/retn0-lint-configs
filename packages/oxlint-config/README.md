# @retn0/oxlint-config

[![npm version](https://img.shields.io/npm/v/@retn0/oxlint-config)](https://www.npmjs.com/package/@retn0/oxlint-config)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/oxlint-config)](https://www.npmjs.com/package/@retn0/oxlint-config)

My personal Oxlint configuration.

## Requirements

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) 1.73.0 or higher
- [oxlint-tsgolint](https://oxc.rs/docs/guide/usage/linter/type-aware) 0.25.x

## Installation

```sh
# npm
npm install -D oxlint oxlint-tsgolint @retn0/oxlint-config

# pnpm
pnpm add -D oxlint oxlint-tsgolint @retn0/oxlint-config

# yarn
yarn add -D oxlint oxlint-tsgolint @retn0/oxlint-config
```

## Usage

This preset creates a complete Oxlint config and enables type-aware linting by default.

Create an `oxlint.config.ts` file in the root of your project:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0();
```

Add local overrides after the shared preset:

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
