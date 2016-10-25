function testAlwaysTrueIf(alwaysTrueIf, buildFlags) {
  return alwaysTrueIf && alwaysTrueIf.some(flg => !!buildFlags[flg]);
}

function sortByPkgName(a, b) {
  if (a.pkgName < b.pkgName) return -1;
  if (a.pkgName > b.pkgName) return 1;
  return 0;
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
    { internal: 'dedupe', url: 'dedupe' },
    { internal: 'minify', url: 'min', alwaysTrueIf: ['dedupe'] },
  ];
  allowedFlags.forEach((flagSet) => {
    const { internal, url, alwaysTrueIf } = flagSet;
    if (buildFlags[internal] || testAlwaysTrueIf(alwaysTrueIf, buildFlags)) selectedFlags.push(`.${url}`);
  });

  const rebuiltPackages = expandedPackages.sort(sortByPkgName).map(combinePkgNameAndVer).join(',');
  const redirEndpoint = `bundle${selectedFlags.join('')}.js`;
  return `/${redirEndpoint}?packages=${rebuiltPackages}`;
}

export default rebuildUrl;
