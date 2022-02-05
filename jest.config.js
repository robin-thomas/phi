const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  roots: ['<rootDir>/tests/'],
  moduleNameMapper: {
    '^@/layouts/(.*)$': '<rootDir>/src/layouts/$1',
  },
  testEnvironment: 'jsdom',
  setupFiles: [
    'jest-prop-types',
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    '@testing-library/react',
  ],
  transform: { // to get the correct coverage.
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
