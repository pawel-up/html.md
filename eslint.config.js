import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import noOnlyTests from 'eslint-plugin-no-only-tests'
import { includeIgnoreFile } from '@eslint/compat'
import { fileURLToPath } from 'node:url'

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))
const __dirname = fileURLToPath(new URL('.', import.meta.url))

/**
 * List of files that must be ignored globally
 */
export const GLOBAL_IGNORE_LIST = [
  '.github/',
  '.husky/',
  '.vscode/*',
  '.wireit/*',
  'build/*',
  'coverage/*',
  'node_modules',
  'scripts/*',
  'eslint.config.js',
  '*.min.*',
  '*.d.ts',
  'CHANGELOG.md',
  'LICENSE*',
  'coverage/**',
  'package-lock.json',
]

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  // eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  includeIgnoreFile(gitignorePath),
  {
    files: ['**/*.ts', 'demo/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
      },
      sourceType: 'module',
    },
    rules: {
      'no-restricted-globals': [
        'error',
        ...Object.keys(globals.node).filter(
          // Disallow Node-specific globals (unless they are shared)
          (g) => !Object.prototype.hasOwnProperty.call(globals.browser, g)
        ),
      ],
      'max-len': [
        'error',
        {
          code: 120,
          comments: 120,
          ignoreUrls: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'no-unreachable': ['error'],
      'no-multi-spaces': ['error'],
      'no-console': ['error'],
      'no-redeclare': ['error'],
      '@typescript-eslint/prefer-literal-enum-member': ['error', {
        allowBitwiseExpressions: true,
      }],
    },
  },
  {
    files: ['tests/**/*.ts'],
    plugins: {
      "no-only-tests": noOnlyTests,
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'no-only-tests/no-only-tests': 'error',
    },
  },
  {
    files: ['demo/**/*.ts'],
    rules: {
      'no-console': 'off'
    }
  },
  {
    ignores: GLOBAL_IGNORE_LIST,
  },
]
