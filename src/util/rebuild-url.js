// @flow

import { isEnvAllowed } from './allowed-envs';
import type { PackagesType, PackageType } from '../types/PackageType';
import type { FlagsType } from '../types/Flags';

function testAlwaysTrueIf(alwaysTrueIf, buildFlags) {
  return alwaysTrueIf && alwaysTrueIf.some(flg => !!buildFlags[flg]);
}

function combinePkgNameAndVer(pkg: PackageType): string {
  const { pkgName, pkgVersion } = pkg;
  if (pkgVersion && pkgVersion !== 'latest') {
    return `${pkgName}@${pkgVersion}`;
  }
  return pkgName;
}

function rebuildUrl(expandedPackages: PackagesType, buildFlags: FlagsType, env: string) {
  const finalEnv = isEnvAllowed(env) ? env : false;
  const selectedFlags = [];
  const allowedFlags = [
    { flag: 'dedupe', alwaysTrueIf: [] },
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
  const flagsParam = selectedFlags.length ? `flags=${selectedFlags.join(',')}` : '';
  const urlParams = [rebuiltPackages, flagsParam].filter(p => !!p).join('&');
  if (!urlParams) {
    return `/${envPrefix}`;
  }
  return `/${envPrefix}?${urlParams}`;
}

export default rebuildUrl;
