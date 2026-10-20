# @retn0/oxlint-config

[![npm version](https://img.shields.io/npm/v/@retn0/oxlint-config)](https://www.npmjs.com/package/@retn0/oxlint-config)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/oxlint-config)](https://www.npmjs.com/package/@retn0/oxlint-config)

My personal Oxlint configuration.

## Requirements

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) 1.87.x
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

Add local overrides after the shared preset:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0(
  {},
  {
    ignorePatterns: ['generated/**'],
    rules: {
      'no-console': 'warn',
    },
  },
);
```

## Feature options

The first argument selects preset features. Subsequent arguments contain native Oxlint configuration overrides:

```ts
export default retn0(
  { js: true, ts: true, react: false, vitest: false },
  { rules: { 'no-console': 'warn' } },
);
```

These defaults and option meanings match `@retn0/eslint-config`:

- `js`: Enable the JavaScript rule set, including Oxlint's ESLint core, Oxc, and Unicorn checks.
- `ts`: Enable TypeScript rules and type-aware linting. Disabling this does not exclude TypeScript files from JavaScript rules or parsing.
- `react`: Enable React and React Hooks checks.
- `vitest`: Enable test-scoped Vitest rules and globals.

Disabled features are not added by the preset. Native overrides can explicitly enable rules or plugins afterward. The factories do not translate overrides between ESLint and Oxlint.

### Migration

The factory now accepts feature options before native overrides. Change `retn0({ rules: ... })` to `retn0({}, { rules: ... })`. Add `{ react: true, vitest: true }` to retain the previous enabled integrations. Oxlint 1.87.x is required so the core-rule metadata used by `js: false` matches the linter.

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
