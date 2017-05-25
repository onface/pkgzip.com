// @flow

import sha256 from 'js-sha256';
import type { PackagesType } from '../types/PackageType';
import type { FlagsType } from '../types/Flags';

const defaultFlags: FlagsType = { minify: false, dedupe: false };

function hashBundle(requestedPkgs: PackagesType = [], flags: FlagsType = defaultFlags) {
  // build obj of known flags
  const presentValues = {};
  ['minify', 'dedupe'].forEach((flag) => {
    const flagVal = flags[flag];
    if (typeof flagVal !== 'undefined') presentValues[flag] = !!flagVal;
  });

  // Override default vals with supplied flags
  const buildFlags: FlagsType = Object.assign({ minify: false, dedupe: false }, presentValues);

  return sha256(JSON.stringify({
    packages: requestedPkgs.map((pkg) => {
      const { pkgName, pkgVersion } = pkg;
      if (!pkgName || !pkgVersion) {
        throw new Error('pkgName and pkgVersion not supplied for hashing');
      }
      return { name: pkgName, ver: pkgVersion };
    }),
    buildFlags,
  }));
}

export default hashBundle;
