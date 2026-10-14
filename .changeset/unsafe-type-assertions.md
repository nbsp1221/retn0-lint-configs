---
'@retn0/eslint-config': minor
'@retn0/oxlint-config': minor
'@retn0/eslint-config-oxlint': patch
---

Report unsafe type assertions and non-null assertions as errors. When combining ESLint and Oxlint, let Oxlint report them without duplicate ESLint diagnostics.

Report unnecessary conditions as errors while allowing literal loop conditions. Keep runtime type guard checks unchanged, and let Oxlint handle this rule when combining both linters.

Apply four existing Oxlint checks to ESLint as well: `no-misused-spread`, `require-array-sort-compare`, `no-unnecessary-parameter-property-assignment`, and `no-useless-default-assignment`. Let Oxlint handle these checks when combining both linters.

Disable `no-meaningless-void-operator` and `no-useless-empty-export` in both presets to preserve intentional getter reads and ambient namespace visibility.
