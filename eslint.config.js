import retn0 from '@retn0/eslint-config';
import eslintConfigOxlint from '@retn0/eslint-config-oxlint';
import { globalIgnores } from 'eslint/config';
import oxlintConfig from './oxlint.config.ts';

export default retn0(
  {
    environments: ['node'],
    perfectionist: true,
    react: true,
  },
  eslintConfigOxlint(oxlintConfig),
  globalIgnores(['packages/*/dist/**']),
);
