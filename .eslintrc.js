const path = require('node:path')

/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: [require.resolve('@r1stack/coding-style/eslint')],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-console': 'warn',
    'linebreak-style': 'error',
    'object-curly-newline': 'error',
    'newline-before-return': 'error',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.mts'],
      parserOptions: {
        project: [
          path.resolve(__dirname, './packages/*/tsconfig.json'),
          path.resolve(__dirname, './packages/examples/*/tsconfig.json'),
        ],
      },
    },
  ],
}