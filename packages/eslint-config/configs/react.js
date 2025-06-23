import react from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export const reactConfigs = defineConfig({
  name: 'retn0/react',
  files: [
    '**/*.{jsx,tsx}',
  ],
  plugins: {
    react,
  },
  rules: {
    ...react.configs.recommended.rules,
  },
});
