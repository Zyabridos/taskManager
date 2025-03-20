import globals from 'globals';
import js from '@eslint/js';

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
        ...globals.node, // add process var to global
        ...globals.browser,
      },
    },
    rules: {
      quotes: ['error', 'single'],
    },
  },
  js.configs.recommended,
];
