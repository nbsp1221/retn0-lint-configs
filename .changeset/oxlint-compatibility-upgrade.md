---
'@retn0/eslint-config-oxlint': minor
---

Update the bundled Oxlint compatibility plugin and require Oxlint 1.89.x. Update Oxlint and its compatible oxlint-tsgolint version together when upgrading this preset. Keep `node_modules/` in `.gitignore`, or pass `--ignore-pattern 'node_modules/**'` to Oxlint.

Disable 12 additional React Hooks rules handled by Oxlint. When both tools use these presets, incompatible-library is now reported as an Oxlint error instead of an ESLint warning.

Preserve ESLint checks when the supplied Oxlint configuration directly disables a category or rule with `off`, `0`, or `allow`. Apply extended rule configurations in Oxlint's precedence order.
