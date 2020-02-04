/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = 'development';
const express = require('express');
// eslint-disable-next-line no-console
console.log('Server is running in development mode');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleWare = require('webpack-hot-middleware');

const port = process.env.PORT;
const app = express();
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
devMiddleware.waitUntilValid(() => {
  app.get('/healthcheck', (req, res) => {
    res.status(200).json({
      farts: 'for your health',
      clownpenis: 'dot fartzz',
    });
  });
});

app.use('/docs', express.static('docs'));
app.use(devMiddleware);
app.use(webpackHotMiddleWare(compiler));

app.listen(port, () => {
  console.log(`Listening on ${port}`); // eslint-disable-line
});
