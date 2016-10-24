import deepEqual from 'lodash.isequal';
import bundleFn from '../modules/bundle';
import expandVersions from '../util/expand-versions';
import { ERR_EXPANSION_NEEDS_REDIRECT } from '../util/errors';

export default function (app) {
  app.get('/bundle(.min)?.js', (req, res) => {
    if (!('packages' in req.query && req.query.packages.length)) {
      res.send(500, 'Please supply a "packages" GET parameter.');
      return;
    }

    const pkgsParam = req.query.packages;
    const requestedPkgs = pkgsParam.split(',').map((pkgDef) => {
      const [pkgName, pkgVersion] = pkgDef.split('@');
      return { pkgName, pkgVersion };
    });
    const buildFlags = {
      minify: req.path === '/bundle.min.js',
    };

    expandVersions(requestedPkgs).then((expandedPackages) => {
      if (deepEqual(requestedPkgs, expandedPackages)) {
        return expandedPackages;
      }
      const rebuiltPackages = expandedPackages.map(pkg => `${pkg.pkgName}@${pkg.pkgVersion}`).join(',');
      const redirEndpoint = buildFlags.minify ? 'bundle.min.js' : 'bundle.js';
      res.redirect(`/${redirEndpoint}?packages=${rebuiltPackages}`);
      throw new Error(ERR_EXPANSION_NEEDS_REDIRECT);
    })
    .then(bundleFn.bind(null, buildFlags)).then((result) => {
      // TODO test: 200 returned if promise resolves
      // TODO test: http response body === resolve result
      // TODO test: http response content type is good for JS
      res.header('Content-Type', 'application/javascript');
      res.send(result);
      return;
    })
    .catch((e) => {
      if (![ERR_EXPANSION_NEEDS_REDIRECT].includes(e.message)) {
        // TODO test 500 returned if promise rejects
        res.status(500).send(e.toString());
      }
    });
  });
}
