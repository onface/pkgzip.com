import fs from 'fs';
import childProc from 'child_process';
import tmpDir from './tmp-dir';
import { TIMER_YARN_INSTALL_TOTAL } from './timer-keys';

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
      console.time(TIMER_YARN_INSTALL_TOTAL); // eslint-disable-line no-console
      childProc.execSync(`cd ${buildDir} && yarn`);
      console.timeEnd(TIMER_YARN_INSTALL_TOTAL); // eslint-disable-line no-console
      resolve({ buildDir });
    } catch (e) {
      console.log('Yarn error', e); // eslint-disable-line no-console
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
