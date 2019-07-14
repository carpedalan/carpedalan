module.exports = {
  presets: [
    [
      '@babel/env',
      {
        // modules: false,
        useBuiltIns: 'usage',
      },
    ],
  ],
  plugins: ['babel-plugin-dynamic-import-node'],
};
