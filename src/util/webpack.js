import webpack from 'webpack';

export default function (opts) {
  const { reqId, fs } = opts;

  const compiler = webpack({
    context: `/${reqId}/`,
    entry: './entry.js',
    output: {
      filename: 'bundle.js',
      path: `/${reqId}/`,
      libraryTarget: 'umd',
    },
    resolve: {
      root: `/${reqId}/node_modules`,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
    ],
  });
  compiler.outputFileSystem = fs;
  compiler.inputFileSystem = fs;
  compiler.resolvers.normal.fileSystem = fs;
  compiler.resolvers.context.fileSystem = fs;

  return compiler;
}
