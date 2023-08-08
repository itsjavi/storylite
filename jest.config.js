/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  coverageProvider: 'v8',
  collectCoverageFrom: ['packages/*/src/**/*.{ts,tsx}'],
  projects: [
    {
      displayName: 'DOM',
      coveragePathIgnorePatterns: ['types.ts', 'index.ts', 'index.tsx', '/node_modules/'],
      testEnvironment: './jest.env-browser.ts',
      testMatch: ['**/*.test.ts', '**/*.test.tsx'],
      testPathIgnorePatterns: ['/node_modules/', '/.local/', '/.ignore/', '/dist/'],
      // setupFilesAfterEnv: ['./jest.setup-browser.js'],
      transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest'],
      },
      transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
    },
    {
      displayName: 'NodeJS',
      coveragePathIgnorePatterns: ['types.ts', 'index.ts', '/node_modules/'],
      testEnvironment: 'node',
      testMatch: ['**/*.test.ts'],
      testPathIgnorePatterns: ['/node_modules/', '/.local/', '/.ignore/', '/dist/', '.dom.test.ts'],
      transform: {
        '^.+\\.(t|j)s$': ['@swc/jest'],
      },
      transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
    },
  ],
}
