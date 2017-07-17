// @flow

import path from 'path';
import os from 'os';
import fs from 'fs';
import childProc from 'child_process';
import tmpDir from './tmp-dir';
import { TIMER_YARN_INSTALL_TOTAL, timeStart, timeEnd } from './timer-keys';
import log from './logger';
import type { PackagesType } from '../types/PackageType';

// create a package.json in the supplied dir
function createPkgJsonFile(packages, buildDir) {
  return new Promise((resolve, reject) => {
    const pkgJsonFile = `${buildDir}/package.json`;
    const pkgJsonSource = { license: 'ISC', dependencies: {} };
    packages.forEach((pkg) => { pkgJsonSource.dependencies[pkg.pkgName] = pkg.pkgVersion; });

    fs.writeFile(pkgJsonFile, JSON.stringify(pkgJsonSource), (err) => {
      if (err) {
        log(err);
        reject(err);
        return;
      }
      resolve(buildDir);
    });
  });
}

// executes `yarn`
function doYarn(buildDir) {
  const yarnBin = path.resolve('./node_modules/yarn/bin/yarn');
  return new Promise((resolve, reject) => {
    try {
      timeStart(TIMER_YARN_INSTALL_TOTAL);
      childProc.exec(`${yarnBin} --ignore-engines --prod --cache-folder ${os.tmpdir()}`, {
        cwd: buildDir,
      }, (err, stdout, stderr) => {
        timeEnd(TIMER_YARN_INSTALL_TOTAL);
        if (err) {
          throw new Error(err);
        }
        if (stdout || stderr) {
          log(stdout || stderr);
        }
        resolve({ buildDir });
      });
    } catch (e) {
      log(`Yarn error ${e}`);
      reject(e);
    }
  });
}

// entry fn
function yarnInstall(packages: PackagesType) {
  return tmpDir().then(createPkgJsonFile.bind(null, packages))
    .then(doYarn)
    .then((pkgJsonResults) => {
      const { buildDir } = pkgJsonResults;
      return { buildDir };
    });
}

export default yarnInstall;
