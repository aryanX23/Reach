import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Critical error prevention
      'no-undef': 'error',
      'no-unused-vars': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-func-assign': 'error',
      'no-unreachable': 'error',
      'valid-typeof': 'error',
      'no-case-declarations': 'error',
      'no-fallthrough': 'error',
      'no-redeclare': 'error',
      'no-self-assign': 'error',
      'no-useless-catch': 'error',
      'no-with': 'error',

      // Important best practices
      'no-var': 'error',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],

      // Basic code quality
      'no-empty': 'warn',
      'no-irregular-whitespace': 'error',
    },
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.env',
      '*.log',
    ],
  },
]; 