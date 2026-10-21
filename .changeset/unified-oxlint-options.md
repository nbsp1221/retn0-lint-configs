---
'@retn0/oxlint-config': major
---

Accept `js`, `ts`, `react`, and `vitest` feature options as the first factory argument, with native Oxlint overrides afterward. JavaScript and TypeScript remain enabled by default; React and Vitest are now opt-in. Move existing overrides from `retn0(overrides)` to `retn0({}, overrides)` and enable `{ react: true, vitest: true }` to retain those integrations. Require Oxlint 1.89.x.
