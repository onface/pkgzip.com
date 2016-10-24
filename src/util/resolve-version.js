import request from 'request';
import semver from 'semver';

function getVersions(pkgName, req) {
  return new Promise((resolve) => {
    req.get({
      url: `https://registry.npmjs.org/${pkgName}`,
      json: true,
    }, (err, resp, body) => {
      if (err || (body && !('versions' in body))) {
        console.log(`Error retrieving versions for ${pkgName}`, err); // eslint-disable-line no-console
        resolve([]);
        return;
      }
      resolve(Object.keys(body.versions).reverse());
    });
  });
}

function resolveVersion(pkgName, pkgRange, req = request) {
  return getVersions(pkgName, req).then((pkgVersions) => {
    const newestMatch = pkgVersions.find(pkgVer => (
      !pkgRange || pkgRange === 'latest' || semver.satisfies(pkgVer, pkgRange)
    ));
    return {
      pkgName,
      pkgVersion: newestMatch,
    };
  });
}

export default resolveVersion;
