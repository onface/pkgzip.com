function testAlwaysTrueIf(alwaysTrueIf, buildFlags) {
  return alwaysTrueIf && alwaysTrueIf.some(flg => !!buildFlags[flg]);
}

function combinePkgNameAndVer(pkg) {
  const { pkgName, pkgVersion } = pkg;
  if (pkgVersion && pkgVersion !== 'latest') {
    return `${pkgName}@${pkgVersion}`;
  }
  return pkgName;
}

function rebuildUrl(expandedPackages, buildFlags) {
  const selectedFlags = [];
  const allowedFlags = [
    { flag: 'dedupe' },
    { flag: 'minify', alwaysTrueIf: ['dedupe'] },
  ];
  allowedFlags.forEach((flagSet) => {
    const { flag, alwaysTrueIf } = flagSet;
    if (buildFlags[flag] || testAlwaysTrueIf(alwaysTrueIf, buildFlags)) {
      selectedFlags.push(flag);
    }
  });

  const rebuiltPackages = expandedPackages.map(combinePkgNameAndVer).join(',');
  const redirEndpoint = `bundle${selectedFlags.join('')}.js`;
  return `/${redirEndpoint}?packages=${rebuiltPackages}`;
}

export default rebuildUrl;
