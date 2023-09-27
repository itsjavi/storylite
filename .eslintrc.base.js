/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  env: {
    es2021: true,
    browser: true,
    node: false,
    commonjs: false,
  },
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    '!.*.js',
    '**/node_modules/**',
    '**/.next/**',
    '**/.turbo/**',
    '**/dist/**',
    'packages/*/dist/**',
    '**/public/**',
  ],
  plugins: ['import', '@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-import-type-side-effects': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    'prefer-const': 'warn',
    'newline-before-return': 'error',
  },
  overrides: [
    {
      files: ['*.jsx', '*.tsx'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:import/react',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      plugins: ['import', 'react', 'react-hooks', 'jsx-a11y', '@typescript-eslint', 'prettier'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/ban-types': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',
        'prefer-const': 'warn',
        'jsx-a11y/alt-text': 'error',
        'react-hooks/exhaustive-deps': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react/jsx-key': 'error',
        'react/no-unescaped-entities': 'off',
        'newline-before-return': 'error',
        'react/react-in-jsx-scope': 'off',
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    {
      files: ['*.js', '*.cjs'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
      env: {
        node: true,
        commonjs: true,
      },
    },
    {
      files: [
        '**/node/**/*.js',
        '**/node/**/*.ts',
        '**/node/**/*.jsx',
        '**/node/**/*.tsx',
        '**/next/**/*.js',
        '**/next/**/*.ts',
        '**/next/**/*.jsx',
        '**/next/**/*.tsx',
        '*.config.js',
        '*.config.ts',
        '*.config.cjs',
        '*.config.mjs',
      ],
      env: {
        es2021: true,
        browser: true,
        node: true,
        commonjs: true,
      },
    },
    {
      files: ['*.test.js', '*.test.ts', '*.test.jsx', '*.test.tsx'],
      env: {
        jest: true,
        node: true,
      },
    },
  ],
}
