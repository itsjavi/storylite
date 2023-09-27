// 'types.ts', 'index.ts', 'index.tsx' are supposed to not have any logic, just type definitions and exports
const coveragePathIgnorePatterns = ['types.ts', 'index.ts', 'index.tsx', '.d.ts', '/node_modules/']

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  coverageProvider: 'v8',
  collectCoverageFrom: ['**/src/**/*.{js,jsx,ts,tsx}'],
  projects: [
    {
      displayName: 'DOM',
      coveragePathIgnorePatterns,
      testEnvironment: __dirname + '/jest.env-browser.js',
      testMatch: ['**/*.test.ts', '**/*.test.tsx'],
      testPathIgnorePatterns: ['/node_modules/', '/.local/', '/.ignore/', '/dist/'],
      // setupFilesAfterEnv: ['./jest.setup-browser.js'],
      transform: {
        '^.+\\.(t|j)sx?$': [
          '@swc/jest',
          {
            jsc: {
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
            },
          },
        ],
      },
      transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
    },
    {
      displayName: 'NodeJS',
      coveragePathIgnorePatterns,
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
