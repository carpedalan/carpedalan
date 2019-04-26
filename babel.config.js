module.exports = {
  presets: [
    [
      '@babel/env',
      {
        // modules: false,
        useBuiltIns: 'usage',
        targets: {
          browsers: ['last 2 versions', 'safari > 8', 'not ie < 11'],
        },
      },
    ],
  ],
  plugins: [
    'babel-plugin-dynamic-import-node',
    [
      'transform-imports',
      {
        'react-router': {
          // eslint-disable-next-line
          transform: 'react-router/${member}',
          preventFullImport: true,
        },
        'react-virtualized': {
          // eslint-disable-next-line
          transform: 'react-virtualized/dist/es/${member}',
          preventFullImport: true,
        },
      },
    ],
  ],
  env: {
    test: {
      plugins: ['babel-plugin-dynamic-import-node'],
    },
    development: {
      plugins: ['react-hot-loader/babel'],
    },
    production: {
      plugins: [
        'transform-react-remove-prop-types',
        [
          'transform-imports',
          {
            'react-router': {
              // eslint-disable-next-line
              transform: 'react-router/${member}',
              preventFullImport: true,
            },
            'react-virtualized': {
              // eslint-disable-next-line
                    transform: 'react-virtualized/dist/es/${member}',
              preventFullImport: true,
            },
          },
        ],
      ],
    },
  },
};
