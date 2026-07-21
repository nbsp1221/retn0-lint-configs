# @retn0/eslint-config-oxlint

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
