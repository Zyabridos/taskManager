import globals from 'globals';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    // ignores: ['dist', '__tests__', '.prettier.config.js'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      quotes: ['error', 'single'],
      'object-curly-newline': ['error', { multiline: true, consistent: true }],
      'one-var': ['error', 'never'],
      'no-trailing-spaces': 'error',
      indent: ['error', 2],
      'prefer-destructuring': ['error', {
        VariableDeclarator: {
          array: true,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      }],
      'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
      'implicit-arrow-linebreak': ['error', 'beside'],
      'arrow-body-style': ['error', 'as-needed'],
      'no-shadow': 'error',
      'no-undef': 'error',
    },
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      }],
    },
  },
  js.configs.recommended,
];
