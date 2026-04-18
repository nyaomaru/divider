const { swcTransform } = require('./jest.swc-transform.cjs');

/** @type {import('jest').Config} **/
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^@/(.+)': '<rootDir>/src/$1',
  },
  transform: swcTransform,
  testMatch: [
    '**/tests/performance/**/*.performance.test.ts'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/tests/integration/'
  ],
}; 
