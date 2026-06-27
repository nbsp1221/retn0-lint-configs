import { defineConfig } from 'eslint/config';
import globalsPackage from 'globals';
import ts from 'typescript-eslint';

export type RuntimeEnvironment = keyof typeof globalsPackage;

interface BaseConfigOptions {
  environments?: RuntimeEnvironment[];
}

export function createBaseConfigs(options: BaseConfigOptions = {}) {
  const { environments = [] } = options;

  const environmentConfigs = environments.map((name) => {
    if (!Object.hasOwn(globalsPackage, name)) {
      throw new Error(
        `Unsupported environment "${name}". Use an environment name supported by the globals package.`,
      );
    }

    return {
      name: `retn0/base/environments/${name}`,
      files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      languageOptions: {
        globals: globalsPackage[name],
      },
    };
  });

  return defineConfig([
    ...environmentConfigs,
    {
      name: 'retn0/base/ts',
      files: ['**/*.{ts,mts,cts,tsx}'],
      languageOptions: {
        parser: ts.parser,
        parserOptions: {
          projectService: true,
        },
      },
    },
    {
      name: 'retn0/base/jsx',
      files: ['**/*.{jsx,tsx}'],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
  ]);
}
