const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  roots: ['<rootDir>/tests/'],
  moduleNameMapper: {
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^@/config/(.*)$': '<rootDir>/src/app/config/$1',
    '^@/layouts/(.*)$': '<rootDir>/src/layouts/$1',
    '^@/modules/(.*)$': '<rootDir>/src/modules/$1',
  },
  testEnvironment: '<rootDir>/tests/testEnv.js',
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    '@testing-library/react',
    '<rootDir>/tests/setup.js',
  ],
  transform: { // to get the correct coverage.
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'], plugins: ['transform-dynamic-import'] }],
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
