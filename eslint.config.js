/* eslint-disable import/no-extraneous-dependencies */
import globals from 'globals';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['dist', '__tests__', '.prettier.config.js'],
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
      indent: ['error', 2],
      'max-len': ['error', { code: 100 }],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-newline': ['error', { multiline: true, consistent: true }],
      'one-var': ['error', 'never'],
      'no-trailing-spaces': 'error',
      'operator-linebreak': ['error', 'before'],
      curly: ['error', 'all'],
      'nonblock-statement-body-position': ['error', 'beside'],
      'function-paren-newline': ['error', 'consistent'],
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: {
            array: true,
            object: true,
          },
          AssignmentExpression: {
            array: false,
            object: false,
          },
        },
      ],
      'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
      'implicit-arrow-linebreak': ['error', 'beside'],
      'arrow-body-style': ['error', 'as-needed'],
      'no-shadow': 'error',
      'no-undef': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
    },
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: false,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
    },
  },
  js.configs.recommended,

  prettier,
];
