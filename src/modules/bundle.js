// import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import camelcase from 'camelcase';
import memoryFs from 'npm-extractor/server/memoryFs';
import npmInstall from './npm-install';

const fs = memoryFs.fs;

const Bundle = requestedPkgs => (
  new Promise((resolve) => {
    const reqId = Date.now();
    const allPkgNames = requestedPkgs.map(pkg => pkg.pkgName);
    const tempPath = path.resolve('./temp');
    const allPromises = requestedPkgs.map(pkg => npmInstall({ allPkgNames, tempPath, fs, finalPath: `/${reqId}/node_modules` }, pkg));
    Promise.all(allPromises)
    .then(() => {
      const entryFile = `/${reqId}/entry.js`;
      const entryContents = allPkgNames.map(pkg => `\nwindow.${camelcase(pkg)} = require('${pkg}');`).join('');
      fs.writeFileSync(entryFile, entryContents);

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

      compiler.run((err) => {
        if (err) throw new Error(err);
        resolve(
          fs.readFileSync(`/${reqId}/bundle.js`, 'utf8')
        );
      });
    }).catch((e) => {
      console.error(e); // eslint-disable-line no-console
      throw new Error(e);
    });
  })
);

export default Bundle;
