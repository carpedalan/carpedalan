module.exports = {
  coverageThreshold: {
    global: {
      statements: 40.5,
      branches: 30.5,
      functions: 30.5,
      lines: 42,
    },
  },
  transform: {
    '^.+\\.jsx?$': 'babel7-jest',
  },
  collectCoverageFrom: [
    'api/**/*',
    'server/**/*',
    '!server/config.js',
    '!server/constants.js',
    '!server/devMiddleware.config.js',
    '!server/db.js',
    '!api/setup/**/*',
  ],

  // transform: {
  //   '\\.m?js$': 'esm',
  // },
  // transformIgnorePatterns: [],
  transformIgnorePatterns: [
    'node_modules/(?!(react-virtualized|react-select|)/)',
  ],

  coverageDirectory: 'reports/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],

  testEnvironment: 'node',
  roots: ['api', 'server'],
  setupTestFrameworkScriptFile: './api/setup/setupTests.js',
  globalSetup: './api/setup/globalSetup.js',
  globalTeardown: './api/setup/globalTeardown.js',
};
