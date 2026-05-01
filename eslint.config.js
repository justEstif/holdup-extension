import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
        chrome: 'readonly',
        globalThis: 'writable',
        HoldupStorage: 'readonly',
      },
    },
    rules: {
      // Complexity limits
      complexity: ['error', 10],
      'max-depth': ['error', 3],
      'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
      'max-params': ['error', 4],
      'max-statements': ['error', 20],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    ignores: ['node_modules/', 'dist/'],
  },
];
