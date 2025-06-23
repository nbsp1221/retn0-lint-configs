import { createConfigs } from '@retn0/eslint-config';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...createConfigs({
    oxlint: true,
  }),
]);
