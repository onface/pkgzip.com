import request from 'request';
import semver from 'semver';
import log from './logger';

function getVersions(pkgName) {
  return new Promise((resolve) => {
    request.get({
      url: `https://registry.npmjs.org/${pkgName}`,
      json: true,
    }, (err, resp, body) => {
      if (err || (body && !('versions' in body))) {
        log(`Error retrieving versions for ${pkgName}`, err);
        resolve([]);
        return;
      }
      resolve(Object.keys(body.versions).reverse());
    });
  });
}

function resolveVersion(pkgName, pkgRange) {
  return getVersions(pkgName).then((pkgVersions) => {
    const newestMatch = pkgVersions.find(pkgVer => (
      !pkgRange || pkgRange === 'latest' || semver.satisfies(pkgVer, pkgRange)
    ));
    return {
      pkgName,
      pkgVersion: newestMatch,
    };
  });
}

module.exports = resolveVersion;

export default resolveVersion;
