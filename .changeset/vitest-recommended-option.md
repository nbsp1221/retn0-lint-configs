---
'@retn0/eslint-config': minor
'@retn0/oxlint-config': minor
'@retn0/eslint-config-oxlint': patch
---

Add an opt-in `vitest` option to the ESLint preset and apply the same recommended rules and test-scoped globals by default in Oxlint. Keep Oxlint's existing override-only factory API and suppress duplicate ESLint Vitest diagnostics through the compatibility package's existing default config array.
