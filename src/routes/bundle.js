import deepEqual from 'lodash.isequal';
import bundleFn from '../modules/bundle';
import expandVersions from '../util/expand-versions';
import { ERR_EXPANSION_NEEDS_REDIRECT } from '../util/errors';
import { TIMER_BUNDLE_REQUEST_DURATION, timeStart, timeEnd } from '../util/timer-keys';
import log from '../util/logger';
import rebuildUrl from '../util/rebuild-url';

function doBundle(req, res, rawBuildFlags = {}) {
  if (!('packages' in req.query && req.query.packages.length)) {
    res.status(500).send('Please supply a "packages" GET parameter.');
    return;
  }

  timeStart(TIMER_BUNDLE_REQUEST_DURATION);
  const pkgsParam = req.query.packages;
  const requestedPkgs = pkgsParam.split(',').map((pkgDef) => {
    const [pkgName, pkgVersion] = pkgDef.split('@');
    return { pkgName, pkgVersion };
  });
  const buildFlags = Object.assign({
    minify: false,
    dedupe: false,
  }, rawBuildFlags);

  expandVersions(requestedPkgs).then((expandedPackages) => {
    if (deepEqual(requestedPkgs, expandedPackages)) {
      return expandedPackages;
    }
    const redirUrl = rebuildUrl(expandedPackages, buildFlags);
    log(`Redirecting after expansion. ${redirUrl}`);
    res.redirect(redirUrl);
    throw new Error(ERR_EXPANSION_NEEDS_REDIRECT);
  })
  .then(bundleFn.bind(null, buildFlags)).then((result) => {
    timeEnd(TIMER_BUNDLE_REQUEST_DURATION);
    res.header('Content-Type', 'application/javascript');
    res.send(result);
    return;
  })
  .catch((e) => {
    timeEnd(TIMER_BUNDLE_REQUEST_DURATION);
    if (![ERR_EXPANSION_NEEDS_REDIRECT].includes(e.message)) {
      res.status(500).send(e.toString());
    }
  });
}

export default function (app) {
  app.get('/bundle.js', (req, res) => {
    doBundle(req, res, {});
  });

  app.get('/bundle.min.js', (req, res) => {
    doBundle(req, res, { minify: true });
  });

  app.get('/bundle.dedupe.min.js', (req, res) => {
    doBundle(req, res, { minify: true, dedupe: true });
  });
}
