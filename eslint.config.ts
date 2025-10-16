import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default defineConfig([
  // Base JS + TS rules
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: ['node_modules/**', 'dist/**', '*.config.js'] },
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.eslint.json',
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        browser: true,
        node: true,
      },
    },

    plugins: { '@typescript-eslint': tseslint.plugin },

    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      semi: ['error', 'always'],
    },
  },

  // Override specifically for Jest config + tests
  {
    files: ['jest.config.ts', 'src/test/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.jest.json',
        tsconfigRootDir: process.cwd(),
      },
      globals: { ...globals.jest, node: true },
    },
  },
]);
