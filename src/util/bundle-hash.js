import sha256 from 'js-sha256';

// TODO: sort packages
function hashBundle(requestedPkgs = [], isMinified = false) {
  return sha256(JSON.stringify({
    packages: requestedPkgs.map((pkg) => {
      const { pkgName, pkgVersion } = pkg;
      if (!pkgName || !pkgVersion) {
        throw new Error('pkgName and pkgVersion not supplied for hashing');
      }
      return { name: pkgName, ver: pkgVersion };
    }),
    isMinified: isMinified ? 1 : 0,
  }));
}

export default hashBundle;
