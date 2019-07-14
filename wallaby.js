module.exports = function(wallaby) {
  return {
    files: [
      '**/*.js?(x)',
      '**/*.hbs',
      '!**/__tests__/*.js?(x)',
      '!**/node_modules/**/*',
      '!src/**/*',
      '!client/**/*',
      '!devtools/**/*',
      '!data.js',
      '!dist/**/*',
      '!coverage/**/*',
      '!scripts/**/*',
      '!**/cypress/**/*',
      'api/__mocks__/*.*',
    ],
    filesWithNoCoverageCalculated: [
      'db/**/*',
      '/*.*',
      'src/**/*',
      'webpack.prod.js',
      'jestrc.js',
      'vandelay-js.js',
      'wallaby.js',
      'shared/constants.js',
      'webpack.config.js',
      'babel.config.js',
      'index.js',
      'api-v1/**/index.js',
      'api-v1/setup/**/*',
      'server/config.js',
      'server/middlewares.js',
      'server/sw.js',
      'server/constants.js',
      'server/devMiddleware.config.js',
      'server/db.js',
      'imageResizer/**/*',
    ],
    tests: [
      'server/**/__tests__/*.js?(x)',
      '!api/**/__tests__/*',
      '!node_modules/**/*',
      '!**/logout.js',
      '!**/node_modules/**/*',
    ],

    env: {
      type: 'node',
      runner: 'node',
      params: {
        env: `LOCAL_PATH=${process.cwd()};WALLABY=true;NODE_ENV=test;LOG_LEVEL=none;NODE_ENV=test;PG_HOST=localhost;PG_PORT=5555;PG_USER=postgres;PG_PASSWORD=postgres;SESSION_SECRET=test;PUBLIC_PASSWORD=testpublic;ADMIN_PASSWORD=testadmin;PG_DATABASE=carpedalan;PORT=3002;CLOUDFRONT_KEY_ID=APKAIUIJTQRAIWFPJFEA`,
      },
    },

    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel(),
    },

    testFramework: 'jest',

    debug: true,

    lowCoverageThreshold: 50,
  };
};
