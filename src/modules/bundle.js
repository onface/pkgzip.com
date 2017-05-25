// @flow

import fs from 'fs';
import yarnInstall from '../util/yarn';
import bundleHash from '../util/bundle-hash';
import { TIMER_WEBPACK_EXECUTION, timeStart, timeEnd } from '../util/timer-keys';
import log from '../util/logger';
import { upload, download } from '../util/s3';
import buildEntryFile from '../util/entry-file';
import decorateResults from '../util/decorate-results';
import webpackGen from '../util/webpack';
import type { FlagsType } from '../types/Flags';
import type { PackagesType } from '../types/PackageType';

const defaultFlags: FlagsType = { minify: false, dedupe: false };

const Bundle = (buildFlags: FlagsType = defaultFlags, requestedPkgs: PackagesType = []) => (
  new Promise((resolve, reject) => {
    const hash = bundleHash(requestedPkgs, buildFlags);
    const cdnFilename = `${hash}.js`;

    download(cdnFilename).then((cdnBody) => {
      resolve(cdnBody); // maybe this block can be skipped
    }).catch(() => {
      log('bundling because not cached');

      yarnInstall(requestedPkgs).then((yarnResult) => {
        const { buildDir } = yarnResult;
        const allPkgNames = requestedPkgs.map(pkg => pkg.pkgName);
        buildEntryFile({
          entryFilePath: `${buildDir}/entry.js`,
          allPkgNames,
        });

        const compiler = webpackGen({ buildDir, buildFlags });

        timeStart(TIMER_WEBPACK_EXECUTION);
        compiler.run((err) => {
          timeEnd(TIMER_WEBPACK_EXECUTION);
          if (err) throw new Error(err);

          const resultJs = decorateResults(allPkgNames, fs.readFileSync(`${buildDir}/bundle.js`, 'utf8'));
          if (resultJs) {
            upload(cdnFilename, resultJs).then(() => resolve(resultJs));
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
