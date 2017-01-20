import { isEnvAllowed } from './allowed-envs';

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

function rebuildUrl(expandedPackages, buildFlags, env) {
  const finalEnv = isEnvAllowed(env) ? env : false;
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

  const envPrefix = finalEnv ? `${finalEnv}/` : '';
  const rebuiltPackages = expandedPackages.map(combinePkgNameAndVer).join(',');
  const flagsParam = selectedFlags.length ? `&flags=${selectedFlags.join(',')}` : '';
  return `/${envPrefix}bundle.js?packages=${rebuiltPackages}${flagsParam}`;
}

export default rebuildUrl;
