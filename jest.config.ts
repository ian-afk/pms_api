import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  globalSetup: '<rootDir>/src/test/globalSetup.ts',
  globalTeardown: '<rootDir>/src/test/globalTeardown.ts',
  setupFilesAfterEnv: ['<rootDir>/src/test/setupFilesAfterEnv.ts'],
  // Optional: automatically map TypeScript paths from tsconfig
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = config;
