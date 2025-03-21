import globals from 'globals';
import js from '@eslint/js';

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
        ...globals.node, // add process var to global
        ...globals.browser,
      },
    },
    rules: {
      quotes: ['error', 'single'],
      'object-curly-newline': ['error', { multiline: true, consistent: true }],
      'one-var': ['error', 'never'],
      'no-trailing-spaces': 'error',
      indent: ['error', 4],
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
      'import/order': ['error', {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      }],
      'implicit-arrow-linebreak': ['error', 'beside'],
      'arrow-body-style': ['error', 'as-needed'],
      'no-shadow': 'error',
      'no-undef': 'error',
    },
  },
  js.configs.recommended,
];
