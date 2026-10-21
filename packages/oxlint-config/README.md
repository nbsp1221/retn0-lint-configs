# @retn0/oxlint-config

[![npm version](https://img.shields.io/npm/v/@retn0/oxlint-config)](https://www.npmjs.com/package/@retn0/oxlint-config)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/oxlint-config)](https://www.npmjs.com/package/@retn0/oxlint-config)

My personal Oxlint configuration.

## Requirements

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) 1.89.x
- [oxlint-tsgolint](https://oxc.rs/docs/guide/usage/linter/type-aware) 7.0.2003 or higher

## Installation

```sh
# npm
npm install -D oxlint oxlint-tsgolint @retn0/oxlint-config

# pnpm
pnpm add -D oxlint oxlint-tsgolint @retn0/oxlint-config

# yarn
yarn add -D oxlint oxlint-tsgolint @retn0/oxlint-config
```

For type-aware linting with Yarn, use `nodeLinker: node-modules` in `.yarnrc.yml`.

## Usage

This preset creates a complete Oxlint config and enables type-aware linting by default.

Create an `oxlint.config.mts` file in the root of your project:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0();
```

Include your TypeScript files in `tsconfig.json`, then run:

```sh
npx oxlint .
```

Keep `node_modules/` in your project's `.gitignore`. Without a `.gitignore`, add `--ignore-pattern 'node_modules/**'` to the Oxlint command.

## Configuration

The default options are:

```ts
export default retn0({
  js: true,
  ts: true,
  react: false,
  vitest: false,
});
```

- `js`: Enable JavaScript rules.
- `ts`: Enable TypeScript rules and type-aware linting. Setting this to `false` does not exclude TypeScript files from linting.
- `react`: Enable React and React Hooks rules.
- `vitest`: Enable Vitest rules and globals for test files.

Pass local overrides after the options:

```ts
export default retn0(
  { react: true },
  {
    ignorePatterns: ['generated/**'],
    rules: {
      'no-console': 'warn',
    },
  },
);
```

## Vitest

Enable recommended Vitest rules and globals with `retn0({ vitest: true })`. They apply only to `**/*.{test,spec}.{js,mjs,cjs,jsx,ts,mts,cts,tsx}`. Files named only by their `__tests__` directory are not included. This pattern also matches other runners, including Node.js, Playwright, and Bun; use scoped rule overrides when mixing runners.

Prefer explicit imports from `vitest`. If using globals in TypeScript, add `vitest/globals` to the test tsconfig.

When overriding scoped Vitest rules, include the plugin in that override. Oxlint does not inherit it from an earlier override:

```ts
export default retn0(
  { vitest: true },
  {
    overrides: [
      {
        files: ['**/*.test.ts'],
        plugins: ['vitest'],
        rules: { 'vitest/no-disabled-tests': 'error' },
      },
    ],
  },
);
```

When also running ESLint, use [`@retn0/eslint-config-oxlint`](../eslint-config-oxlint#vitest) to avoid duplicate diagnostics.

## License

MIT © [nbsp1221](https://github.com/nbsp1221)
