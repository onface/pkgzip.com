/* eslint import/no-extraneous-dependencies: 0 */

import chai from 'chai';
import getEndpoint from '../bin/get-endpoint';

const expect = chai.expect;

describe('package resolver', () => {
  it('should show homepage if no packages passed', (done) => {
    getEndpoint('/?')
    .then(({ response, body }) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.contain('Your npm packages, webpacked with dependencies.');
      done();
    });
  });

  it('should redirect 1.x versions to the correct fixed URL', (done) => {
    getEndpoint('/?skatejs@1.x')
    .then(({ response }) => {
      expect(response.statusCode).to.equal(302);
      expect(response.headers.location).to.match(/^\/\?skatejs@[0-9]+\.[0-9]+\.[0-9]/);
      done();
    });
  });
});

describe('bundling use cases', () => {
  it('should return valid response for unscoped package with fixed version', (done) => {
    getEndpoint('/?left-pad@1.1.3')
    .then(({ response, body }) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.contain('webpackUniversalModuleDefinition');
      expect(body).to.not.contain('MODULE_NOT_FOUND');
      done();
    });
  });

  it('should return valid response for scoped package with fixed version', (done) => {
    getEndpoint('/?@atlaskit/util-shared-styles@1.2.0')
    .then(({ response, body }) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.contain('webpackUniversalModuleDefinition');
      expect(body).to.not.contain('MODULE_NOT_FOUND');
      done();
    });
  });

  it('should return valid response but include module_not_found for missing peer dep', (done) => {
    getEndpoint('/?@atlaskit/util-shared-styles@1.5.0')
    .then(({ response, body }) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.contain('webpackUniversalModuleDefinition');
      expect(body).to.contain('Cannot find module \\"styled-components\\""); e.code = \'MODULE_NOT_FOUND');
      done();
    });
  });
});

describe('decoration', () => {
  it('should prefix response with usage/exports explanation', (done) => {
    getEndpoint('/?preact@7.2.0')
    .then(({ response, body }) => {
      expect(response.statusCode).to.equal(200);
      expect(body).to.contain("// The following objects are now available!:\n\n// window.pkgzip['preact']");
      done();
    });
  });
});
