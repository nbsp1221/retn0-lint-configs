---
'@retn0/eslint-config-oxlint': minor
---

Replace the default config array with a factory accepting `js`, `ts`, `react`, and `vitest` feature options. Call `eslintConfigOxlint()` and pass the same feature choices as the Oxlint preset; React and Vitest default to disabled. Project-specific native overrides remain separate in each linter.
