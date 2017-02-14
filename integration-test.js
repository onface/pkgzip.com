/* eslint-disable no-console */

const path = require('path');
const request = require('request');
const exec = require('child_process').exec;

const slsBin = path.join(__dirname, 'node_modules', '.bin', 'sls');
const randomPort = Math.floor(1000 + (8999 * Math.random()));

exec(`${slsBin} offline --dontPrintOutput --noTimeout --port=${randomPort} --stage=dev`, {
  env: process.env,
}, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});

const testContains = (testName, endpoint, contains, checkHeaders) => (
  new Promise((resolve, reject) => {
    request({
      url: `http://localhost:${randomPort}${endpoint}`,
      followRedirect: false,
    }, (err, resp, body) => {
      const fieldBody = checkHeaders ? JSON.stringify(resp.headers) : body;
      if (!fieldBody || fieldBody.indexOf(contains) === -1) {
        console.log('fieldBody', fieldBody);
        reject(`${testName} - ${endpoint}${checkHeaders ? ' headers' : ''} does not contain '${contains}'`);
        return;
      }
      console.log(`✅ ${testName}`);
      resolve();
    });
  })
);

setTimeout(() => {
  testContains('No packages message', '/bundle.js', 'Please supply at least 1 npm package')
  .then(() => testContains('Unscoped packages', '/bundle.js?packages=left-pad@1.1.3', 'webpackUniversalModuleDefinition'))
  .then(() => testContains('Scoped packages', '/bundle.js?packages=@atlaskit/button@1.0.0', 'webpackUniversalModuleDefinition'))
  .then(() => testContains('Decoration', '/bundle.js?packages=preact@7.2.0', "// The following objects are now available!:\n\n// window.pkgzip['preact']"))
  .then(() => testContains('Version expansion redirect', '/bundle.js?packages=skatejs@1.x', 'location":', true))
  .then(() => testContains('Ignoring npm engines field', '/bundle.js?packages=ak-navigation@11.2.3', 'webpackUniversalModuleDefinition')) // testing 'engines' ignore flag since lambda only supports node 4.3
  .then(() => {
    console.log('');
    console.log('✅ All integration tests passed');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌', err);
    process.exit(1);
  });
}, 2000);
