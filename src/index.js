import express from 'express';
import bundleFn from './modules/bundle';

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
  bundleFn(requestedPkgs).then((result) => {
    // TODO test: 200 returned if promise resolves
    // TODO test: http response body === resolve result
    // TODO test: http response content type is good for JS
    res.header('Content-Type', 'application/javascript');
    res.send(result);
  }).catch((e) => {
    // TODO test 500 returned if promise rejects
    res.send(500, e.toString());
  });
});

const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening at http://0.0.0.0:${port} :)`); // eslint-disable-line no-console
});
