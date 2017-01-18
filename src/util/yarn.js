import path from 'path';
import os from 'os';
import fs from 'fs';
import childProc from 'child_process';
import tmpDir from './tmp-dir';
import { TIMER_YARN_INSTALL_TOTAL, timeStart, timeEnd } from './timer-keys';
import log from './logger';

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
      childProc.exec(`${yarnBin} --ignore-engines --cache-folder ${os.tmpdir()}`, { cwd: buildDir }, (err) => {
      // childProc.exec(`${yarnBin} --ignore-engines`, { cwd: buildDir }, (err) => {
        timeEnd(TIMER_YARN_INSTALL_TOTAL);
        if (err) {
          throw new Error(err);
        }
        resolve({ buildDir });
      });
    } catch (e) {
      log('Yarn error', e);
      reject(e);
    }
  });
}

// entry fn
function yarnInstall(packages) {
  return new Promise((resolve, reject) => {
    tmpDir().then(createPkgJsonFile.bind(null, packages)).then(doYarn).then((pkgJsonResults) => {
      const { buildDir } = pkgJsonResults;
      return resolve({ buildDir });
    })
    .catch((e) => {
      reject(e);
    });
  });
}

export default yarnInstall;
