/** @type {import('jest').Config} **/
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^@/(.+)': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      '@swc/jest',
      {
        module: {
          type: 'commonjs',
        },
        jsc: {
          parser: {
            syntax: 'typescript',
          },
          target: 'es2022',
        },
      },
    ],
  },
  testMatch: [
    '**/tests/**/*.test.ts'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/tests/integration/',
    '<rootDir>/tests/performance/'
  ],
};
