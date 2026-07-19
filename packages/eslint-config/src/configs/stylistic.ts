import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';

const structuralDeclaration = {
  selector: [
    'ClassDeclaration',
    'FunctionDeclaration',
    'TSInterfaceDeclaration',
    'TSEnumDeclaration',
    'TSModuleDeclaration',
    'ExportNamedDeclaration[declaration.type="ClassDeclaration"]',
    'ExportNamedDeclaration[declaration.type="FunctionDeclaration"]',
    'ExportNamedDeclaration[declaration.type="TSInterfaceDeclaration"]',
    'ExportNamedDeclaration[declaration.type="TSEnumDeclaration"]',
    'ExportNamedDeclaration[declaration.type="TSModuleDeclaration"]',
    'ExportDefaultDeclaration[declaration.type="ClassDeclaration"]',
    'ExportDefaultDeclaration[declaration.type="FunctionDeclaration"]',
  ].join(', '),
};

const typeAlias = {
  selector: [
    'TSTypeAliasDeclaration',
    'ExportNamedDeclaration[declaration.type="TSTypeAliasDeclaration"]',
  ].join(', '),
};

const arrowFunction = {
  selector: [
    'VariableDeclaration:has(> VariableDeclarator[init.type="ArrowFunctionExpression"])',
    'ExportNamedDeclaration[declaration.declarations.0.init.type="ArrowFunctionExpression"]',
    'ExportDefaultDeclaration[declaration.type="ArrowFunctionExpression"]',
  ].join(', '),
};

const singlelineTypeAlias = { ...typeAlias, lineMode: 'singleline' };
const singlelineArrowFunction = { ...arrowFunction, lineMode: 'singleline' };

export const stylisticConfigs = defineConfig({
  name: 'retn0/stylistic',
  files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  plugins: {
    '@stylistic': stylistic,
  },
  rules: {
    /**
     * @see https://eslint.style/rules/padding-line-between-statements
     */
    '@stylistic/padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: structuralDeclaration, next: '*' },
      { blankLine: 'always', prev: '*', next: structuralDeclaration },
      { blankLine: 'always', prev: typeAlias, next: '*' },
      { blankLine: 'always', prev: '*', next: typeAlias },
      { blankLine: 'always', prev: arrowFunction, next: '*' },
      { blankLine: 'always', prev: '*', next: arrowFunction },
      { blankLine: 'any', prev: singlelineTypeAlias, next: singlelineTypeAlias },
      { blankLine: 'any', prev: singlelineArrowFunction, next: singlelineArrowFunction },
      { blankLine: 'never', prev: 'function-overload', next: 'function-overload' },
      { blankLine: 'never', prev: 'function-overload', next: 'function' },
    ],
  },
});
