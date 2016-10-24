import express from 'express';
import deepEqual from 'lodash.isequal';
import bundleFn from './modules/bundle';
import expandVersions from './util/expand-versions';
import { ERR_EXPANSION_NEEDS_REDIRECT } from './util/errors';

const app = express();

app.use(express.static('public'));

app.get('/healthcheck', (req, res) => {
  res.send('OK');
});

app.get('/bundle.js', (req, res) => {
  if (!('packages' in req.query && req.query.packages.length)) {
    res.send(500, 'Please supply a "packages" GET parameter.');
    return;
  }

  const pkgsParam = req.query.packages;
  const requestedPkgs = pkgsParam.split(',').map((pkgDef) => {
    const [pkgName, pkgVersion] = pkgDef.split('@');
    return { pkgName, pkgVersion };
  });
  expandVersions(requestedPkgs).then((expandedPackages) => {
    if (deepEqual(requestedPkgs, expandedPackages)) {
      return expandedPackages;
    }
    const rebuiltPackages = expandedPackages.map(pkg => `${pkg.pkgName}@${pkg.pkgVersion}`).join(',');
    res.redirect(`/bundle.js?packages=${rebuiltPackages}`);
    throw new Error(ERR_EXPANSION_NEEDS_REDIRECT);
  })
  .then(bundleFn).then((result) => {
    // TODO test: 200 returned if promise resolves
    // TODO test: http response body === resolve result
    // TODO test: http response content type is good for JS
    res.header('Content-Type', 'application/javascript');
    res.send(result);
  })
  .catch((e) => {
    if (![ERR_EXPANSION_NEEDS_REDIRECT].includes(e.message)) {
      // TODO test 500 returned if promise rejects
      res.status(500).send(e.toString());
    }
  });
});

const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening at http://0.0.0.0:${port} :)`); // eslint-disable-line no-console
});
