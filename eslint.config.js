import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'

export default typescriptEslint.config(
  {
    ignores: ['*.d.ts', '**/coverage', '**/dist', 'node_modules/', 'src-tauri/'],
  },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs['flat/recommended'],
    ],
    files: ['**/*.{js,mjs,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'error',

      // Console
      'no-console': ['error', { allow: ['error'] }],

      // Naming
      camelcase: 'error',
    },
  },
  eslintConfigPrettier,
)
