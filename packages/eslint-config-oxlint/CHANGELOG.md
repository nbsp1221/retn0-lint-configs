# @retn0/eslint-config-oxlint

## 0.2.0

### Minor Changes

- [#5](https://github.com/nbsp1221/retn0-lint-configs/pull/5) [`5f367d9`](https://github.com/nbsp1221/retn0-lint-configs/commit/5f367d9be7727c4db39a1e7ac4d9e11db2861082) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Update the bundled Oxlint compatibility plugin and require Oxlint 1.89.x. Update Oxlint and its compatible oxlint-tsgolint version together when upgrading this preset.

  Disable 12 additional React Hooks rules handled by Oxlint. When both tools use these presets, incompatible-library is now reported as an Oxlint error instead of an ESLint warning.

- [#10](https://github.com/nbsp1221/retn0-lint-configs/pull/10) [`4dce870`](https://github.com/nbsp1221/retn0-lint-configs/commit/4dce8706a0320bda2e2ff8506e761e935d47fb51) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Replace the default config array with a factory accepting your Oxlint configuration. Import your Oxlint config and pass it to `eslintConfigOxlint(oxlintConfig)` instead of passing `eslintConfigOxlint` directly.

### Patch Changes

- [#8](https://github.com/nbsp1221/retn0-lint-configs/pull/8) [`b04c0eb`](https://github.com/nbsp1221/retn0-lint-configs/commit/b04c0eb6eabbc6cd2116046c5e8cd5fbddda3dda) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Report unsafe type assertions and non-null assertions as errors. When combining ESLint and Oxlint, let Oxlint report them without duplicate ESLint diagnostics.

  Report unnecessary conditions as errors while allowing literal loop conditions. Keep runtime type guard checks unchanged, and let Oxlint handle this rule when combining both linters.

  Apply four existing Oxlint checks to ESLint as well: `no-misused-spread`, `require-array-sort-compare`, `no-unnecessary-parameter-property-assignment`, and `no-useless-default-assignment`. Let Oxlint handle these checks when combining both linters.

  Disable `no-meaningless-void-operator` and `no-useless-empty-export` in both presets to preserve intentional getter reads and ambient namespace visibility.

  Enable `return-await` with `error-handling-correctness-only`, `use-unknown-in-catch-callback-variable`, `prefer-readonly`, and `no-unnecessary-type-conversion` as errors in both presets. Let Oxlint handle these checks when combining both linters.

- [#9](https://github.com/nbsp1221/retn0-lint-configs/pull/9) [`23dc17e`](https://github.com/nbsp1221/retn0-lint-configs/commit/23dc17e221e710abbe3dfa63323dab8d7fece372) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Add an opt-in `vitest` option to both lint presets with matching recommended rules and test-scoped globals. Suppress duplicate ESLint Vitest diagnostics through the compatibility factory.

## 0.1.2

### Patch Changes

- [`7e78466`](https://github.com/nbsp1221/retn0-lint-configs/commit/7e78466fd391b93ed57d32465305b29197a52f24) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Disable ESLint's `curly` rule when Oxlint compatibility is enabled, preventing duplicate diagnostics when both linters are used.

- [`2daffae`](https://github.com/nbsp1221/retn0-lint-configs/commit/2daffae956011a23f2463a4dcd9d570eb20d4366) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Add maintainability warnings for extreme file size, function size, and nesting depth while excluding test and spec files.

- [`8728515`](https://github.com/nbsp1221/retn0-lint-configs/commit/87285151d976f4e618318b6c8358e585b6bae375) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Enable `no-unreachable-loop` for Oxlint users and align the Oxlint ecosystem dependencies on compatible versions.

## 0.1.1

### Patch Changes

- [#2](https://github.com/nbsp1221/retn0-lint-configs/pull/2) [`becc9d4`](https://github.com/nbsp1221/retn0-lint-configs/commit/becc9d41f5ab7b2079e320a7f74b1db19a1d487f) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Change `@retn0/oxlint-config` to export a config factory.

  ```ts
  import retn0 from '@retn0/oxlint-config';

  export default retn0();
  ```

  The factory returns a complete root Oxlint config, including default ignore patterns for `node_modules`, `dist`, and `coverage`.
