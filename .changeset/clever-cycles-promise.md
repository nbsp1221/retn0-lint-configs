---
'@retn0/oxlint-config': minor
'@retn0/eslint-config-oxlint': patch
---

Change `@retn0/oxlint-config` to export a config factory.

```ts
import retn0 from '@retn0/oxlint-config';

export default retn0();
```

The factory returns a complete root Oxlint config, including default ignore patterns for `node_modules`, `dist`, and `coverage`.
