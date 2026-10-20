# @retn0/eslint-config-oxlint

[![npm version](https://img.shields.io/npm/v/@retn0/eslint-config-oxlint)](https://www.npmjs.com/package/@retn0/eslint-config-oxlint)
[![npm downloads](https://img.shields.io/npm/dm/@retn0/eslint-config-oxlint)](https://www.npmjs.com/package/@retn0/eslint-config-oxlint)

My personal ESLint compatibility configuration for `@retn0/oxlint-config`.

## Requirements

- [Node.js](https://nodejs.org) 24.0.0 or higher
- [ESLint](https://eslint.org) 10.x
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) 1.87.x
- [oxlint-tsgolint](https://oxc.rs/docs/guide/usage/linter/type-aware) 7.0.2003 or higher

## Installation

```sh
# npm
npm install -D eslint oxlint oxlint-tsgolint @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config

# pnpm
pnpm add -D eslint oxlint oxlint-tsgolint @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config

# yarn
yarn add -D eslint oxlint oxlint-tsgolint typescript@6 @retn0/eslint-config @retn0/eslint-config-oxlint @retn0/oxlint-config
```

For type-aware linting with Yarn, use `nodeLinker: node-modules` in `.yarnrc.yml`.

## Usage

Create `oxlint.config.mts`:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0();
```

Create `eslint.config.mjs` and append the compatibility config after the base config:

```js
import retn0 from '@retn0/eslint-config';
import eslintConfigOxlint from '@retn0/eslint-config-oxlint';
import oxlintConfig from './oxlint.config.mts';

export default retn0(
  {
    environments: ['node'],
  },
  eslintConfigOxlint(oxlintConfig),
);
```

Include your TypeScript source and config files in `tsconfig.json`.

Then run both tools:

```json
{
  "scripts": {
    "lint": "oxlint . && eslint ."
  }
}
```

## Configuration

JavaScript and TypeScript rules are enabled by default. React and Vitest are opt-in. The compatibility config reads the Oxlint configuration you pass to it.

For a React project using Vitest, configure `oxlint.config.mts`:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0({ react: true, vitest: true });
```

Then configure `eslint.config.mjs`:

```js
import retn0 from '@retn0/eslint-config';
import eslintConfigOxlint from '@retn0/eslint-config-oxlint';
import oxlintConfig from './oxlint.config.mts';

export default retn0(
  { environments: ['browser'], react: true, vitest: true },
  eslintConfigOxlint(oxlintConfig),
);
```

### Custom rules

Configure custom rules separately in each linter. To run a rule in ESLint instead of Oxlint, disable it in `oxlint.config.mts`:

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0({}, { rules: { 'no-console': 'off' } });
```

Then enable it after the compatibility config in `eslint.config.mjs`:

```js
export default retn0({ environments: ['node'] }, eslintConfigOxlint(oxlintConfig), {
  rules: { 'no-console': 'warn' },
});
```

Oxlint ignore patterns also apply to ESLint. For file-specific rule exceptions, place explicit ESLint overrides after the compatibility config.

## Vitest

With `vitest: true`, Oxlint runs the recommended Vitest rules on matching test files. See the [Vitest setup](../oxlint-config#vitest) for file patterns and globals. Enable [ESLint's `vitest` option](../eslint-config#vitest) as well when using Vitest globals.

## License

MIT © [nbsp1221](https://github.com/nbsp1221)
