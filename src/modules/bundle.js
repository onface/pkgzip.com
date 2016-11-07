import camelcase from 'camelcase';
import fs from 'fs';
import yarnInstall from '../util/yarn';
import bundleHash from '../util/bundle-hash';
import { TIMER_WEBPACK_EXECUTION, timeStart, timeEnd } from '../util/timer-keys';
import log from '../util/logger';
import { upload, download } from '../util/s3';
import watermark from '../util/watermark';

import webpackGen from '../util/webpack';

const Bundle = (buildFlags = {}, requestedPkgs = []) => (
  new Promise((resolve, reject) => {
    const allPkgNames = requestedPkgs.map(pkg => pkg.pkgName);
    const hash = bundleHash(requestedPkgs, buildFlags);
    const cdnFilename = `${hash}.js`;

    download(cdnFilename).then((cdnBody) => {
      resolve(cdnBody); // maybe this block can be skipped
    }).catch(() => {
      log('bundling because not cached');

      yarnInstall(requestedPkgs).then((yarnResult) => {
        const { buildDir } = yarnResult;
        const entryFile = `${buildDir}/entry.js`;
        const entryContents = allPkgNames.map(pkg => `\nwindow.${camelcase(pkg)} = require('${pkg}');`).join('');
        fs.writeFileSync(entryFile, entryContents);

        const compiler = webpackGen({ buildDir, buildFlags });

        timeStart(TIMER_WEBPACK_EXECUTION);
        compiler.run((err) => {
          timeEnd(TIMER_WEBPACK_EXECUTION);
          if (err) throw new Error(err);

          const resultJs = fs.readFileSync(`${buildDir}/bundle.js`, 'utf8');
          if (resultJs) {
            const watermarkJs = `${watermark}\n${resultJs}`;
            upload(cdnFilename, watermarkJs).then(() => resolve(watermarkJs));
          } else {
            reject('No results');
          }
        });
      }).catch((err) => {
        log({ err, stack: err.stack });
        throw new Error(err);
      });
    });
  })
);

export default Bundle;
