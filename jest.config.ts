import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',

  testEnvironment: 'node',

  moduleFileExtensions: ['ts', 'js', 'json'],

  rootDir: '.',

  testRegex: '.*\\.spec\\.ts$',

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json',
      },
    ],
  },

  extensionsToTreatAsEsm: ['.ts'],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
};

export default config;
