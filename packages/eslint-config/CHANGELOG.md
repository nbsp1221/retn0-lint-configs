# @retn0/eslint-config

## 2.2.0

### Minor Changes

- [#5](https://github.com/nbsp1221/retn0-lint-configs/pull/5) [`5f367d9`](https://github.com/nbsp1221/retn0-lint-configs/commit/5f367d9be7727c4db39a1e7ac4d9e11db2861082) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Update ESLint plugins. React checks now detect additional cases, including components created through logical or sequence expressions during render, so existing code may produce new lint errors.

- [#8](https://github.com/nbsp1221/retn0-lint-configs/pull/8) [`b04c0eb`](https://github.com/nbsp1221/retn0-lint-configs/commit/b04c0eb6eabbc6cd2116046c5e8cd5fbddda3dda) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Report unsafe type assertions and non-null assertions as errors. When combining ESLint and Oxlint, let Oxlint report them without duplicate ESLint diagnostics.

  Report unnecessary conditions as errors while allowing literal loop conditions. Keep runtime type guard checks unchanged, and let Oxlint handle this rule when combining both linters.

  Apply four existing Oxlint checks to ESLint as well: `no-misused-spread`, `require-array-sort-compare`, `no-unnecessary-parameter-property-assignment`, and `no-useless-default-assignment`. Let Oxlint handle these checks when combining both linters.

  Disable `no-meaningless-void-operator` and `no-useless-empty-export` in both presets to preserve intentional getter reads and ambient namespace visibility.

  Enable `return-await` with `error-handling-correctness-only`, `use-unknown-in-catch-callback-variable`, `prefer-readonly`, and `no-unnecessary-type-conversion` as errors in both presets. Let Oxlint handle these checks when combining both linters.

## 2.1.0

### Minor Changes

- [`2daffae`](https://github.com/nbsp1221/retn0-lint-configs/commit/2daffae956011a23f2463a4dcd9d570eb20d4366) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Add maintainability warnings for extreme file size, function size, and nesting depth while excluding test and spec files.

- [`e51df0f`](https://github.com/nbsp1221/retn0-lint-configs/commit/e51df0f5024c580120249ae6106362c1ed29a098) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Separate structural and multiline declarations with blank lines while allowing compact groups of single-line type aliases and arrow functions.

- [`8e5eb91`](https://github.com/nbsp1221/retn0-lint-configs/commit/8e5eb913f979106ee0a01bf8159e56d07572951b) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Rename the `javascript` and `typescript` options to `js` and `ts`.

- [`7e78466`](https://github.com/nbsp1221/retn0-lint-configs/commit/7e78466fd391b93ed57d32465305b29197a52f24) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Require curly braces for all control statements by enabling `curly` with the `"all"` option. Brace-less control statements now report an auto-fixable error.

- [`19a1774`](https://github.com/nbsp1221/retn0-lint-configs/commit/19a17740a1905f8f0e12cccb9c7fb4db97951cf6) Thanks [@nbsp1221](https://github.com/nbsp1221)! - Update ESLint and its related plugins to their latest compatible versions.
