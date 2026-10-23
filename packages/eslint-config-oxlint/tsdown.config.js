import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  fixedExtension: false,
  format: ['esm'],
  deps: {
    alwaysBundle: ['@retn0/common'],
  },
});
