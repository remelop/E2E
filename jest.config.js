// jest.config.js - ACTUALIZADO CON SETUP
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.js'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|expo(nent)?|@expo(nent)?/.*|@unimodules|unimodules|@react-native-community|@react-native-picker|@testing-library|firebase|@firebase|expo-firebase.*|@react-native-async-storage/async-storage|expo-.*|@expo-google-fonts/.*|react-navigation|@sentry/react-native|native-base|react-native-svg|react-native-vector-icons|react-native-paper|react-native-safe-area-context|react-native-screens))'
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/jest.config.js',
    '!**/babel.config.js',
    '!**/jest.setup.js'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  testEnvironment: 'node',
  verbose: true,
  cache: false
};