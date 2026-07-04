# @retn0/eslint-config-oxlint

## 0.1.1

### Patch Changes

- [#2](https://github.com/nbsp1221/retn0-lint-configs/pull/2) [`becc9d4`](https://github.com/nbsp1221/retn0-lint-configs/commit/becc9d41f5ab7b2079e320a7f74b1db19a1d487f) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Change `@retn0/oxlint-config` to export a config factory.

  ```ts
  import retn0 from "@retn0/oxlint-config";

  export default retn0();
  ```

  The factory returns a complete root Oxlint config, including default ignore patterns for `node_modules`, `dist`, and `coverage`.
