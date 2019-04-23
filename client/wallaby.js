module.exports = function(wallaby) {
  return {
    files: [
      '**/*.ts?(x)',
      'setupTests.js',
      '**/*.hbs',
      '!**/__tests__/*.ts?(x)',
      '!**/node_modules/**/*',
      '!devtools/**/*',
      '!data.js',
      '!dist/**/*',
      '!coverage/**/*',
      '!scripts/**/*',
      '!**/cypress/**/*',
      'api/__mocks__/*.*',
      'tsconfig.json',
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
      '**/__tests__/*.ts?(x)',
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

      '**/*.ts?(x)': wallaby.compilers.typeScript(),
    },

    testFramework: 'jest',

    debug: true,

    lowCoverageThreshold: 50,
  };
};
