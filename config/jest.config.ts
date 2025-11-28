import type { Config } from 'jest';

const config: Config = {

    preset: 'ts-jest',

    testEnvironment: 'node',

    testMatch: ['**/tests/**/*.test.ts'],

    clearMocks: true,

    forceExit: true,

    verbose: true,
};

export default config;