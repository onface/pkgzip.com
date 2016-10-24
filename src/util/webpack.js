import webpack from 'webpack';

export default function (opts) {
  const { buildDir } = opts;

  const compiler = webpack({
    context: buildDir,
    entry: './entry.js',
    output: {
      filename: 'bundle.js',
      path: buildDir,
      libraryTarget: 'umd',
    },
    resolve: {
      root: `${buildDir}/node_modules`,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
    ],
  });

  return compiler;
}
