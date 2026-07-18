import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';
import reactRefresh from 'eslint-plugin-react-refresh';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const configFilePath = fileURLToPath(import.meta.url);
const configDirectory = path.dirname(configFilePath);

const compat = new FlatCompat({
  baseDirectory: configDirectory,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const typescriptConfigs = compat
  .extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
  )
  .map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  }));

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  ...compat.extends('airbnb'),
  ...typescriptConfigs,
  ...compat.extends('prettier'),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: configDirectory,
      },
      globals: globals.browser,
    },
    plugins: {
      'react-refresh': reactRefresh,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
            properties: false,
          },
        },
      ],
      'arrow-body-style': 'off',
      'consistent-return': 'off',
      'default-param-last': 'off',
      'linebreak-style': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import/no-unresolved': [
        'error',
        {
          ignore: ['\\?react$', '\\.svg$'],
        },
      ],
      'import/prefer-default-export': 'off',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-filename-extension': [
        'error',
        {
          extensions: ['.tsx'],
        },
      ],
      'jsx-quotes': ['error', 'prefer-single'],
      'no-param-reassign': [
        'error',
        {
          props: false,
        },
      ],
      'no-void': [
        'error',
        {
          allowAsStatement: true,
        },
      ],
      'operator-linebreak': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': [
        'error',
        {
          allowConstantExport: true,
        },
      ],
    },
  },
  {
    files: ['src/features/garage/delete-car/ui/DeleteCarButton.tsx'],
    rules: {
      'no-alert': 'off',
    },
  },
  {
    files: ['eslint.config.js', 'vite.config.ts'],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 'off',
      'linebreak-style': 'off',
    },
  },
];
