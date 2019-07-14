module.exports = {
  env: {
    development: {
      plugins: [
        'react-hot-loader/babel',
        '@babel/plugin-syntax-dynamic-import',
      ],
    },
    test: {
      plugins: [],
    },
  },
};
