import sha256 from 'js-sha256';

function hashBundle(requestedPkgs = [], flags = {}) {
  // build obj of known flags
  const presentValues = {};
  ['minify', 'dedupe'].forEach((flag) => {
    const flagVal = flags[flag];
    if (typeof flagVal !== 'undefined') presentValues[flag] = !!flagVal;
  });

  // Override default vals with supplied flags
  const buildFlags = Object.assign({ minify: false, dedupe: false }, presentValues);

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
