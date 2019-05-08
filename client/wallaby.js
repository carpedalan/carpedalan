module.exports = function(wallaby) {
  return {
    files: [
      'src/**/*.ts?(x)',
      { pattern: '**/*.d.ts', ignore: true },
      'setupTests.js',
      '!**/__tests__/*.ts?(x)',
      '!**/node_modules/**/*',
      '!dist/**/*',
      '!coverage/**/*',
      '!scripts/**/*',
      'tsconfig.json',
      'jest.config.js',
      'package.json',
    ],
    filesWithNoCoverageCalculated: [
      'db/**/*',
      '/*.*',
      'webpack.prod.js',
      'jestrc.config.json',
      'vandelay-js.js',
      'wallaby.js',
      'shared/constants.js',
      'webpack.config.js',
      'babel.config.js',
      'index.js',
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
      // '**/*.js?(x)': wallaby.compilers.babel(),

      '**/*.ts?(x)': wallaby.compilers.typeScript({ isolatedModules: true }),
    },
    preprocessors: {
      /* eslint-disable */
      '**/*.ts?(x)': file =>
        require('@babel/core').transform(file.content, {
          sourceMap: true,
          filename: file.path,
          presets: [require('babel-preset-jest')],
        }),
        /* eslint-enable */
    },

    testFramework: 'jest',

    debug: true,

    lowCoverageThreshold: 50,
    setup() {
      const jestConfig = require(`${wallaby.localProjectDir}/jest.config.js`); // eslint-disable-line
      jestConfig.transform = {};
      wallaby.testFramework.configure(jestConfig);
    },
  };
};
