/* eslint import/no-extraneous-dependencies: 0 */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import proxyquire from 'proxyquire';

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('resolveVersion()', () => {
  describe('success cases', () => {
    let resolveVersion;

    // simulates request of https://registry.npmjs.org/ak-button
    before(() => {
      resolveVersion = proxyquire('../../src/util/resolve-version', {
        request: {
          get: (opts, callback) => {
            callback(null, '', {
              name: 'ak-button',
              versions: {
                '0.1.0': {},
                '0.2.0': {},
                '0.3.0': {},
                '0.5.0': {},
                '0.5.1': {},
                '0.5.2': {},
                '1.0.0': {},
                '1.2.0': {},
                '1.3.0': {},
                '1.3.1': {},
                '1.3.2': {},
                '1.3.3': {},
                '1.4.0': {},
                '1.4.1': {},
                '1.4.3': {},
                '1.4.4': {},
                '1.4.5': {},
                '1.4.6': {},
                '1.4.7': {},
                '1.5.0': {},
                '1.5.1': {},
                '1.5.2': {},
                '1.6.0': {},
              },
            });
          },
        },
      });
    });

    it('should handle N.x version format', () => (
      expect(resolveVersion('ak-button', '0.x')).to.eventually.deep.equal(
        { pkgName: 'ak-button', pkgVersion: '0.5.2' }
      )
    ));

    it('should handle caret ^ versions', () => (
      expect(resolveVersion('ak-button', '^1.5.1')).to.eventually.deep.equal(
        { pkgName: 'ak-button', pkgVersion: '1.6.0' }
      )
    ));

    it('should handle tilde ~ versions', () => (
      expect(resolveVersion('ak-button', '~1.5.1')).to.eventually.deep.equal(
        { pkgName: 'ak-button', pkgVersion: '1.5.2' }
      )
    ));

    it('should handle > versions', () => (
      expect(resolveVersion('ak-button', '>1.3.3')).to.eventually.deep.equal(
        { pkgName: 'ak-button', pkgVersion: '1.6.0' }
      )
    ));

    it('should handle >= versions', () => (
      expect(resolveVersion('ak-button', '>=1.3.3')).to.eventually.deep.equal(
        { pkgName: 'ak-button', pkgVersion: '1.6.0' }
      )
    ));

    it('should handle < versions', () => (
      expect(resolveVersion('ak-button', '<1.0.0')).to.eventually.deep.equal(
        { pkgName: 'ak-button', pkgVersion: '0.5.2' }
      )
    ));

    it('should handle <= versions', () => (
      expect(resolveVersion('ak-button', '<=1.0.0')).to.eventually.deep.equal(
        { pkgName: 'ak-button', pkgVersion: '1.0.0' }
      )
    ));

    it('should return latest if no version requested supplied', () => (
      expect(resolveVersion('ak-button', '')).to.eventually.deep.equal(
        { pkgName: 'ak-button', pkgVersion: '1.6.0' }
      )
    ));

    it('should return latest if "latest" supplied', () => (
      expect(resolveVersion('ak-button', 'latest')).to.eventually.deep.equal(
        { pkgName: 'ak-button', pkgVersion: '1.6.0' }
      )
    ));
  });

  describe('failure cases', () => {
    let resolveVersion;

    // simulates request of https://registry.npmjs.org/ak-button
    before(() => {
      resolveVersion = proxyquire('../../src/util/resolve-version', {
        request: {
          get: (opts, callback) => {
            callback('Not found', null, null);
          },
        },
      });
    });

    it('should resolve promise with empty version for unknown component', () => (
      expect(resolveVersion('ak-doesnt-exist', '0.x')).to.eventually.deep.equal(
        { pkgName: 'ak-doesnt-exist', pkgVersion: undefined }
      )
    ));
  });
});
