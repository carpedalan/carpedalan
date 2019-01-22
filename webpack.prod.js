const path = require('path');

const dotenv = require('dotenv-safe');
const webpack = require('webpack');
const Manifest = require('webpack-manifest-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const CompressionPlugin = require('compression-webpack-plugin');
const S3Plugin = require('webpack-s3-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

dotenv.config();

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    client: ['./src/mount.prod'],
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    // alias: {
    //   'react-virtualized/List': 'react-virtualized/dist/es/List',
    //   'react-virtualized/Grid': 'react-virtualized/dist/es/Grid',
    //   'react-virtualized/CellMeasurer':
    //     'react-virtualized/dist/es/CellMeasurer',
    //   'react-virtualized/CellMeasurerCache':
    //     'react-virtualized/dist/es/CellMeasurerCache',
    //   'react-virtualized/AutoSizer': 'react-virtualized/dist/es/AutoSizer',
    //   'react-virtualized/WindowScroller':
    //     'react-virtualized/dist/es/WindowScroller',
    //   'react-virtualized/InfiniteLoader':
    //     'react-virtualized/dist/es/InfiniteLoader',
    // },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    // htmlWebpackPlugin,
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        LOG_LEVEL: JSON.stringify(process.env.LOG_LEVEL),
        CDN_DOMAIN: JSON.stringify(process.env.CDN_DOMAIN),
      },
    }),
    new Manifest(),
    new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
    new CompressionPlugin({
      exclude: 'manifest.json',
      filename: '[path]',
    }),
    new S3Plugin({
      // s3Options are required
      s3Options: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'us-west-2',
      },
      s3UploadOptions: {
        Bucket: 'carpe-assets',
        ContentEncoding: 'gzip',
      },
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
