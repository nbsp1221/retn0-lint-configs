# @retn0/oxlint-config

## 3.0.0

### Major Changes

- [#5](https://github.com/nbsp1221/retn0-lint-configs/pull/5) [`5f367d9`](https://github.com/nbsp1221/retn0-lint-configs/commit/5f367d9be7727c4db39a1e7ac4d9e11db2861082) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Require Oxlint 1.86.0 or newer within 1.x and oxlint-tsgolint 7.0.2003 or newer. Update both tools when upgrading this preset.

  The updated correctness category enables 13 additional error-level rules: oxc/bad-match-all-arg and 12 React checks, including incompatible-library and set-state-in-effect. Existing code may produce new lint errors.

### Minor Changes

- [#8](https://github.com/nbsp1221/retn0-lint-configs/pull/8) [`b04c0eb`](https://github.com/nbsp1221/retn0-lint-configs/commit/b04c0eb6eabbc6cd2116046c5e8cd5fbddda3dda) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Report unsafe type assertions and non-null assertions as errors. When combining ESLint and Oxlint, let Oxlint report them without duplicate ESLint diagnostics.

  Report unnecessary conditions as errors while allowing literal loop conditions. Keep runtime type guard checks unchanged, and let Oxlint handle this rule when combining both linters.

  Apply four existing Oxlint checks to ESLint as well: `no-misused-spread`, `require-array-sort-compare`, `no-unnecessary-parameter-property-assignment`, and `no-useless-default-assignment`. Let Oxlint handle these checks when combining both linters.

  Disable `no-meaningless-void-operator` and `no-useless-empty-export` in both presets to preserve intentional getter reads and ambient namespace visibility.

  Enable `return-await` with `error-handling-correctness-only`, `use-unknown-in-catch-callback-variable`, `prefer-readonly`, and `no-unnecessary-type-conversion` as errors in both presets. Let Oxlint handle these checks when combining both linters.

## 2.2.0

### Minor Changes

- [`2daffae`](https://github.com/nbsp1221/retn0-lint-configs/commit/2daffae956011a23f2463a4dcd9d570eb20d4366) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Add maintainability warnings for extreme file size, function size, and nesting depth while excluding test and spec files.

- [`8728515`](https://github.com/nbsp1221/retn0-lint-configs/commit/87285151d976f4e618318b6c8358e585b6bae375) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Enable `no-unreachable-loop` for Oxlint users and align the Oxlint ecosystem dependencies on compatible versions.

- [`7e78466`](https://github.com/nbsp1221/retn0-lint-configs/commit/7e78466fd391b93ed57d32465305b29197a52f24) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Require curly braces for all control statements by enabling `curly` with the `"all"` option. Brace-less control statements now report an auto-fixable error.

## 2.1.0

### Minor Changes

- [#2](https://github.com/nbsp1221/retn0-lint-configs/pull/2) [`becc9d4`](https://github.com/nbsp1221/retn0-lint-configs/commit/becc9d41f5ab7b2079e320a7f74b1db19a1d487f) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Change `@retn0/oxlint-config` to export a config factory.

  ```ts
  import retn0 from '@retn0/oxlint-config';

  export default retn0();
  ```

  The factory returns a complete root Oxlint config, including default ignore patterns for `node_modules`, `dist`, and `coverage`.
