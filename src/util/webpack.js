// @flow

import webpack from 'webpack';
import type { FlagsType } from '../types/Flags';

type WebpackBuildOptsType = {
  buildDir: string,
  buildFlags: FlagsType
}

export default function ({ buildDir, buildFlags }: WebpackBuildOptsType) {
  const selectedPlugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ];

  if (buildFlags.minify) {
    selectedPlugins.push(new webpack.optimize.UglifyJsPlugin({
      include: 'bundle.js',
    }));
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
      modules: [`${buildDir}/node_modules`],
    },
    plugins: selectedPlugins,
  });

  return compiler;
}
