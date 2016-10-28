// const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = {
  entry: ['./src/index.js'],
  output: {
    path: __dirname,
    filename: 'dist/bundle.js',
  },
  module: {
    preLoaders: [
      { test: /\.json$/, exclude: /node_modules/, loader: 'json' },
    ],
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
      },
    ],
  },
  target: 'node',
  plugins: [
    // new webpack.optimize.UglifyJsPlugin(),
    // new webpack.optimize.DedupePlugin(),
  ],
  // node: {
  //   fs: 'empty',
  //   child_process: 'empty',
  //   net: 'empty',
  // },
};
