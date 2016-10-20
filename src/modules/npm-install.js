// import fs from 'fs';
import extractor from 'npm-extractor/server/extractor';

export default function (opts, pkg) {
  const { allPkgNames, tempPath, finalPath, fs } = opts;
  const { pkgName, pkgVersion } = pkg;
  return extractor({
    package: pkgName,
    targetFs: fs,
    version: pkgVersion,
    allPackages: allPkgNames,
    options: {
      registry: 'http://registry.npmjs.org/',
      mindelay: 5000,
      maxDelay: 10000,
      retries: 5,
      factor: 5,
    },
    tempPath,
    memoryPath: finalPath,
  });
}
