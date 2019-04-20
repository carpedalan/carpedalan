/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = 'development';
const app = require('express')();
// eslint-disable-next-line no-console
console.log('Server is running in development mode');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleWare = require('webpack-hot-middleware');

require('ts-node').register({
  compilerOptions: { module: 'commonjs' },
  cacheDirectory: '/tmp',
});
const webpackConfig = require('./webpack.config');

const compiler = webpack(webpackConfig);

const devMiddleware = webpackDevMiddleware(compiler, {
  noInfo: true,
  stats: 'none',
  publicPath: webpackConfig.output.publicPath,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers':
      'X-Requested-With, content-type, Authorization',
    'X-FARTS': 'stinky',
  },
});

app.use(devMiddleware);
app.use(webpackHotMiddleWare(compiler, { log: false }));

app.listen(4000, () => {
  console.log('listening'); // eslint-disable-line
});
