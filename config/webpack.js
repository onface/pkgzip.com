import path from 'path';

export default function (opts) {
  const { tempPath, reqId } = opts;
  console.log('tempPath', tempPath);
  return {
    context: tempPath,
    entry: './entry.js',
    output: {
      path: `./dist`,
      filename: `${reqId}.js`,
    },
    // resolveLoader: {
    //   root: path.resolve('node_modules'),
    // },
    resolve: {
      root: path.join(tempPath, 'node_modules'),
    },
    plugins: [],
    // module: {
    //   loaders: [{
    //     test: /\.json$/,
    //     loader: 'json',
    //   }],
    // },
  };
}
