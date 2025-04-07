import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginTailwindcss from 'eslint-plugin-tailwindcss';
import eslintPluginI18next from 'eslint-plugin-i18next';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Next.js defaults
  ...compat.extends('next/core-web-vitals'),

  // Common config
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      react: eslintPluginReact,
      tailwindcss: eslintPluginTailwindcss,
      i18next: eslintPluginI18next,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],

      // Tailwind rules
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-custom-classname': 'off',

      // i18next rules
      'i18next/no-literal-string': [
        'warn',
        {
          markupOnly: true,
          ignoreAttribute: ['data-testid', 'key'],
        },
      ],

      // Prettier integration
      // 'prettier/prettier': 'warn',
    },
  },

  // Disable ESLint rules that conflict with Prettier
  {
    name: 'prettier-compat',
    rules: eslintConfigPrettier.rules,
  },
];
