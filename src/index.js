import deepEqual from 'lodash.isequal';
import homepage from 'raw-loader!./assets/index.html'; // eslint-disable-line
import bundleFn from './modules/bundle';
import expandVersions from './util/expand-versions';
import rebuildUrl from './util/rebuild-url';
import detectEnv from './util/detect-env';
import parsePkgTag from './util/parse-pkg-tag';
import { ERR_EXPANSION_NEEDS_REDIRECT } from './util/errors';
import { TIMER_BUNDLE_REQUEST_DURATION, timeStart, timeEnd } from './util/timer-keys';
import log from './util/logger';

module.exports.bundler = (event, context, callback) => {
  function respond(statusCode = 200, message, contentType = 'application/javascript') {
    timeEnd(TIMER_BUNDLE_REQUEST_DURATION);
    const headers = statusCode === 302
      ? { Location: message }
      : { 'Content-Type': contentType };

    const response = {
      statusCode,
      headers,
      body: message,
    };
    callback(null, response);
  }

  timeStart(TIMER_BUNDLE_REQUEST_DURATION);

  log(`Running on node ${process.version}`);

  if (event.path.indexOf('acme-challenge') >= 0) {
    log('Returning acme-challenge');
    respond(200, 'FTF0SR7NZxpyl3G8RgPZRS9AEW4bh6QeRatMMUNBXJA.7eu-EA4FaZIm7bXVEEqhX9OEIpVR3ZyiqdyAXawNqWE', 'text/plain');
  }

  const params = Object.assign({
    flags: '',
  }, event.queryStringParameters);

  const pkgsParam = Object.keys(params).find(param => param !== 'flags');

  if (!pkgsParam) {
    respond(200, homepage, 'text/html; charset=UTF-8');
    return;
  }

  const requestedPkgs = pkgsParam.split(',').map(parsePkgTag).filter(p => !!p);

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
    const detectedEnv = detectEnv(event.path);
    const redirUrl = rebuildUrl(expandedPackages, buildFlags, detectedEnv);
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
