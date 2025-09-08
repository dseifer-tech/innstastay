// Uses Next's SWC for TS/JS – no ts-jest required.
const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  testEnvironment: 'node',
  // Match both __tests__/ and tests/ folders
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)', '**/tests/**/*.(test|spec).(ts|tsx)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // supports your "@/..." imports
  },
}

module.exports = createJestConfig(customJestConfig)
