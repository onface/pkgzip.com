import deepEqual from 'lodash.isequal';
import bundleFn from './modules/lambda';
import expandVersions from './util/expand-versions';
import rebuildUrl from './util/rebuild-url';
import { ERR_EXPANSION_NEEDS_REDIRECT } from './util/errors';

module.exports.bundle = (event, context, callback) => {
  console.log(JSON.stringify(process.env)); // eslint-disable-line no-console
  function respond(statusCode = 200, message) {
    const headers = statusCode === 302
      ? { Location: message }
      : { 'Content-Type': 'application/javascript' };

    const response = {
      statusCode,
      headers,
      body: message,
    };
    callback(null, response);
  }

  const params = Object.assign({
    packages: '',
    flags: '',
  }, event.queryStringParameters);

  const pkgsParam = params.packages;
  const requestedPkgs = pkgsParam.split(',').map((pkgDef) => {
    const [pkgName, pkgVersion] = pkgDef.split('@');
    return pkgName ? { pkgName, pkgVersion } : null;
  }).filter(p => !!p);

  if (!requestedPkgs.length) {
    respond(500, 'Please supply at least 1 npm package name in the packages parameter');
    return;
  }

  const rawBuildFlags = params.flags.split(',');
  const buildFlags = {
    minify: rawBuildFlags.includes('minify'),
    dedupe: rawBuildFlags.includes('dedupe'),
  };

  expandVersions(requestedPkgs).then((expandedPackages) => {
    if (deepEqual(requestedPkgs, expandedPackages)) {
      return expandedPackages;
    }
    const redirUrl = rebuildUrl(expandedPackages, buildFlags);
    respond(302, redirUrl);
    throw new Error(ERR_EXPANSION_NEEDS_REDIRECT);
  })
  .then(bundleFn.bind(null, buildFlags)).then((result) => {
    respond(200, result);
  })
  .catch((err) => {
    if (![ERR_EXPANSION_NEEDS_REDIRECT].includes(err.message)) {
      respond(500, err);
    }
  });
};
