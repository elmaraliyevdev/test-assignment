module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/backend'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'backend/**/*.ts',
    '!backend/dist/**',
    '!backend/**/*.test.ts',
  ],
  coverageDirectory: 'coverage/backend',
};