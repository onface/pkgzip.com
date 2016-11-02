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
    { flag: 'dedupe' },
    { flag: 'minify', alwaysTrueIf: ['dedupe'] },
  ];
  allowedFlags.forEach((flagSet) => {
    const { flag, alwaysTrueIf } = flagSet;
    if (buildFlags[flag] || testAlwaysTrueIf(alwaysTrueIf, buildFlags)) {
      selectedFlags.push(flag);
    }
  });

  const rebuiltPackages = expandedPackages.sort(sortByPkgName).map(combinePkgNameAndVer).join(',');
  const flagsParam = selectedFlags.length ? `&flags=${selectedFlags.join(',')}` : '';
  return `/dev/bundle.js?packages=${rebuiltPackages}${flagsParam}`;
}

export default rebuildUrl;
