/* eslint-disable import/no-extraneous-dependencies */
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: ['./src/index.js'],
  output: {
    path: __dirname,
    filename: 'handler.js',
    libraryTarget: 'umd',
    library: 'pkgzip',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json',
      },
      {
        loader: 'babel-loader',
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
      },
    ],
  },
  target: 'node',
  externals: [nodeExternals()],
};
