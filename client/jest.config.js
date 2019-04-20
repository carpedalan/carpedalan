module.exports = {
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  verbose: false,
  modulePaths: ['<rootDir>/src'],
  roots: ['<rootDir>/src'],
  testPathIgnorePatterns: [
    '__stories__',
    '<rootDir>/.storybook',
    '<rootDir>/node_modules',
    '<rootDir>/dist',
    '<rootDir>/build',
  ],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(j|t)sx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!@lyft/flyteidl)'],
  coverageDirectory: '.coverage',
  collectCoverageFrom: ['**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: [
    '__stories__',
    '<rootDir>/.storybook',
    '<rootDir>/node_modules',
    '<rootDir>/dist',
    '<rootDir>/build',
    '<rootDir>/src/tsd',
    '<rootDir>/.eslintrc.js',
    '\\.config.js$',
  ],
  coverageReporters: ['text'],
  clearMocks: true,
  setupFiles: ['<rootDir>/node_modules/regenerator-runtime/runtime'],
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  snapshotSerializers: ['enzyme-to-json/serializer'],
  preset: 'ts-jest',
};
