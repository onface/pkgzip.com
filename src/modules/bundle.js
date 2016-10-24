import camelcase from 'camelcase';
import fs from 'fs';
import yarnInstall from '../util/yarn';
import bundleHash from '../util/bundle-hash';
import { upload, download } from '../util/s3';
import { TIMER_WEBPACK_EXECUTION } from '../util/timer-keys';

import webpackGen from '../util/webpack';

const Bundle = (buildFlags = {}, requestedPkgs = []) => (
  new Promise((resolve, reject) => {
    const allPkgNames = requestedPkgs.map(pkg => pkg.pkgName);
    const hash = bundleHash(requestedPkgs, buildFlags);
    const cdnFilename = `${hash}.js`;

    download(cdnFilename).then((cdnBody) => {
      resolve(cdnBody); // maybe this block can be skipped
    }).catch((e) => {
      console.log('bundling because not cached'); // eslint-disable-line no-console

      yarnInstall(requestedPkgs).then((yarnResult) => {
        const { buildDir } = yarnResult;
        const entryFile = `${buildDir}/entry.js`;
        const entryContents = allPkgNames.map(pkg => `\nwindow.${camelcase(pkg)} = require('${pkg}');`).join('');
        fs.writeFileSync(entryFile, entryContents);

        const compiler = webpackGen({ buildDir, buildFlags });

        console.time(TIMER_WEBPACK_EXECUTION); // eslint-disable-line no-console
        compiler.run((err) => {
          console.timeEnd(TIMER_WEBPACK_EXECUTION); // eslint-disable-line no-console
          if (err) throw new Error(err);

          const resultJs = fs.readFileSync(`${buildDir}/bundle.js`, 'utf8');
          upload(cdnFilename, resultJs).then(() => resolve(resultJs)).catch((e2) => {
            if (resultJs) {
              resolve(resultJs);
              return;
            }
            reject(e2);
          });
        });
      }).catch((err) => {
        console.error(err, err.stack); // eslint-disable-line no-console
        throw new Error(e);
      });
    });
  })
);

export default Bundle;
