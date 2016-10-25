import fs from 'fs';
import childProc from 'child_process';
import tmpDir from './tmp-dir';
import { TIMER_YARN_INSTALL_TOTAL, timeStart, timeEnd } from './timer-keys';
import log from './logger';

// create a package.json in the supplied dir
function createPkgJsonFile(packages, buildDir) {
  return new Promise((resolve) => {
    const pkgJsonFile = `${buildDir}/package.json`;
    const pkgJsonSource = { license: 'ISC', dependencies: {} };
    packages.forEach((pkg) => { pkgJsonSource.dependencies[pkg.pkgName] = pkg.pkgVersion; });

    fs.writeFileSync(pkgJsonFile, JSON.stringify(pkgJsonSource));
    resolve(buildDir);
  });
}

// executes `yarn`
function doYarn(buildDir) {
  return new Promise((resolve, reject) => {
    try {
      timeStart(TIMER_YARN_INSTALL_TOTAL);
      childProc.exec(`cd ${buildDir} && yarn`, (err) => {
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
