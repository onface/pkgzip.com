import path from 'path';
import camelcase from 'camelcase';
import memoryFs from 'npm-extractor/server/memoryFs';
import npmInstall from './npm-install';
import webpackGen from '../util/webpack';
import { upload, download } from '../util/s3';
import { TIMER_NPM_INSTALL_TOTAL, TIMER_WEBPACK_EXECUTION } from '../util/timer-keys';

const fs = memoryFs.fs;

const Bundle = requestedPkgs => (
  new Promise((resolve) => {
    const reqId = Date.now();
    const allPkgNames = requestedPkgs.map(pkg => pkg.pkgName);
    const bundleHash = requestedPkgs.map(pkg => `${pkg.pkgName}@${pkg.pkgVersion}`).join(',');
    const cdnFilename = `${bundleHash}.js`;

    download(cdnFilename).then((cdnBody) => {
      resolve(cdnBody); // maybe this block can be skipped
    }).catch((e) => {
      console.log('bundling because not cached'); // eslint-disable-line no-console
      console.time(TIMER_NPM_INSTALL_TOTAL); // eslint-disable-line no-console
      const tempPath = path.resolve('./temp');
      const allPromises = requestedPkgs.map(
        pkg => npmInstall({ allPkgNames, tempPath, fs, finalPath: `/${reqId}/node_modules` }, pkg)
      );

      Promise.all(allPromises).then(() => {
        console.timeEnd(TIMER_NPM_INSTALL_TOTAL); // eslint-disable-line no-console
        const entryFile = `/${reqId}/entry.js`;
        const entryContents = allPkgNames.map(pkg => `\nwindow.${camelcase(pkg)} = require('${pkg}');`).join('');
        fs.writeFileSync(entryFile, entryContents);

        const compiler = webpackGen({ reqId, fs });

        console.time(TIMER_WEBPACK_EXECUTION); // eslint-disable-line no-console
        compiler.run((err) => {
          console.timeEnd(TIMER_WEBPACK_EXECUTION); // eslint-disable-line no-console
          if (err) throw new Error(err);

          const resultJs = fs.readFileSync(`/${reqId}/bundle.js`, 'utf8');
          upload(cdnFilename, resultJs).then(() => resolve(resultJs));
        });
      }).catch((err) => {
        console.error(err, err.stack); // eslint-disable-line no-console
        throw new Error(e);
      });
    });
  })
);

export default Bundle;
