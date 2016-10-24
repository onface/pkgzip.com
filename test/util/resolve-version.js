/* eslint import/no-extraneous-dependencies: 0 */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
// import proxyquire from 'proxyquire';
import resolveVersion from '../../src/util/resolve-version';

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('resolveVersion()', () => {
  describe('success cases', () => {
    // simulates request of https://registry.npmjs.org/ak-button
    const reqMock = {
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
    };

    it('should handle N.x version format', () => (
      expect(resolveVersion('ak-button', '0.x', reqMock)).to.eventually.deep.equal(
        { pkgName: 'ak-button', pkgVersion: '0.5.2' }
      )
    ));

    it('should handle caret ^ versions', () => (
      expect(resolveVersion('ak-button', '^1.5.1', reqMock)).to.eventually.deep.equal(
        { pkgName: 'ak-button', pkgVersion: '1.6.0' }
      )
    ));

    it('should handle tilde ~ versions', () => (
      expect(resolveVersion('ak-button', '~1.5.1', reqMock)).to.eventually.deep.equal(
        { pkgName: 'ak-button', pkgVersion: '1.5.2' }
      )
    ));

    it('should handle > versions', () => (
      expect(resolveVersion('ak-button', '>1.3.3', reqMock)).to.eventually.deep.equal(
        { pkgName: 'ak-button', pkgVersion: '1.6.0' }
      )
    ));

    it('should handle >= versions', () => (
      expect(resolveVersion('ak-button', '>=1.3.3', reqMock)).to.eventually.deep.equal(
        { pkgName: 'ak-button', pkgVersion: '1.6.0' }
      )
    ));

    it('should handle < versions', () => (
      expect(resolveVersion('ak-button', '<1.0.0', reqMock)).to.eventually.deep.equal(
        { pkgName: 'ak-button', pkgVersion: '0.5.2' }
      )
    ));

    it('should handle <= versions', () => (
      expect(resolveVersion('ak-button', '<=1.0.0', reqMock)).to.eventually.deep.equal(
        { pkgName: 'ak-button', pkgVersion: '1.0.0' }
      )
    ));
  });

  describe('failure cases', () => {
    // simulates request of https://registry.npmjs.org/ak-doesnt-exist
    const reqMock = {
      get: (opts, callback) => {
        callback('Not found', null, null);
      },
    };

    it('should resolve promise with empty version for unknown component', () => (
      expect(resolveVersion('ak-doesnt-exist', '0.x', reqMock)).to.eventually.deep.equal(
        { pkgName: 'ak-doesnt-exist', pkgVersion: undefined }
      )
    ));
  });
});
