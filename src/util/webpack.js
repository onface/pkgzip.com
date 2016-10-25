import webpack from 'webpack';

export default function (opts) {
  const { buildDir, buildFlags } = opts;

  const selectedPlugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ];

  if (buildFlags.minify) {
    selectedPlugins.push(
      new webpack.optimize.UglifyJsPlugin({
        include: 'bundle.js',
      })
    );
  }

  if (buildFlags.dedupe) {
    selectedPlugins.push(
      new webpack.optimize.DedupePlugin({
        include: 'bundle.js',
      })
    );
  }

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
    plugins: selectedPlugins,
  });

  return compiler;
}
