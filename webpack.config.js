/*
    ./webpack.config.js
*/
const path = require('path');

const webpack = require('webpack');
const HappyPack = require('happypack');

module.exports = {
  context: path.resolve(__dirname),
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    client: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      './src/mount',
    ],
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'happypack/loader?id=jsx',
      },
    ],
  },
  plugins: [
    new HappyPack({
      id: 'jsx',
      threads: 12,
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
      ],
    }),
    new webpack.DefinePlugin({
      process: {
        env: {
          LOG_LEVEL: JSON.stringify('silly'),
        },
      },
    }),

    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    stats: {
      // copied from `'minimal'`
      all: false,
      modules: false,
      maxModules: 0,
      errors: true,
      warnings: true,
    },
  },
  stats: {
    // copied from `'minimal'`
    all: false,
    modules: true,
    maxModules: 0,
    errors: true,
    warnings: true,
    // our additional options
  },
};
