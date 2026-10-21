---
'@retn0/oxlint-config': major
---

Require Oxlint 1.89.x and oxlint-tsgolint 7.0.2003 or newer. Update both tools when upgrading this preset. Keep `node_modules/` in `.gitignore`, or pass `--ignore-pattern 'node_modules/**'` to Oxlint.

The updated correctness category enables 13 additional error-level rules: oxc/bad-match-all-arg and 12 React checks, including incompatible-library and set-state-in-effect. Existing code may produce new lint errors.
