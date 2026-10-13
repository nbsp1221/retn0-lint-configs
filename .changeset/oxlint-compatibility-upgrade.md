---
'@retn0/eslint-config-oxlint': minor
---

Update the bundled Oxlint compatibility plugin and require Oxlint 1.87.x. Update Oxlint and its compatible oxlint-tsgolint version together when upgrading this preset.

Disable 12 additional React Hooks rules handled by Oxlint. When both tools use these presets, incompatible-library is now reported as an Oxlint error instead of an ESLint warning.
