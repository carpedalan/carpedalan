/*
    ./webpack.config.js
*/
const path = require('path');

const webpack = require('webpack');
// const HappyPack = require('happypack');
const Stylish = require('webpack-stylish');
const HappyPack = require('happypack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname),
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    client: [
      'webpack-hot-middleware/client?path=//local.carpedalan.com/__webpack_hmr&timeout=20000&noInfo=true&quiet=true',
      './src/mount',
    ],
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '//local.carpedalan.com/dist/',
  },
  resolve: {
    /** Base directories that Webpack will look to resolve absolutely imported modules */
    modules: ['src', 'node_modules'],
    /** Extension that are allowed to be omitted from import statements */
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    /** "main" fields in package.json files to resolve a CommonJS module for */
    mainFields: ['browser', 'module', 'main'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'happypack/loader?id=ts',
      },
    ],
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
    new HappyPack({
      id: 'ts',
      loaders: ['babel-loader', 'ts-loader?happyPackMode=true'],
    }),

    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        LOG_LEVEL: JSON.stringify(process.env.LOG_LEVEL),
        CDN_DOMAIN: JSON.stringify(process.env.CDN_DOMAIN),
      },
    }),
    new webpack.DefinePlugin({
      process: {
        env: {
          LOG_LEVEL: JSON.stringify('silly'),
        },
      },
    }),
    new Stylish(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    stats: 'none',
  },
  stats: 'none',
};
