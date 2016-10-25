/* eslint import/no-extraneous-dependencies: 0 */

import chai from 'chai';
import hashBundle from '../../src/util/bundle-hash';

const expect = chai.expect;

describe('hashBundle()', () => {
  it('should update hash based on packages array', () => {
    const buildFlags = { minify: true };

    const hashResultA = hashBundle([
      { pkgName: 'package-one', pkgVersion: '0.0.1' },
    ], buildFlags);

    const hashResultB = hashBundle([
      { pkgName: 'package-one', pkgVersion: '0.0.2' },
    ], buildFlags);

    const hashResultC = hashBundle([
      { pkgName: 'package-two', pkgVersion: '0.0.1' },
    ], buildFlags);

    const hashResultD = hashBundle([
      { pkgName: 'package-two', pkgVersion: '0.0.2' },
    ], buildFlags);

    expect(hashResultA).to.equal('1ba247835242029bceb967a75b623cf8874822bc879da68543ffb7c66997b8dd');
    expect(hashResultB).to.equal('38aad12ba9a7c1b6d783907d0a8fff8226f3c72cee0363a15391e81b86ddc077');
    expect(hashResultC).to.equal('c5e5ea8eecb4641e5f93af3ec0a84789d03c7c8863bcab7502a03a3686890864');
    expect(hashResultD).to.equal('6660a485e718b70240898adbfb0b97852832f9f5034a2b41771c4e4b1d9419b2');

    expect(hashResultA.length).to.equal(64); // length must be < 1024 for AWS S3 keys
  });

  it('should update hash based on build flags array', () => {
    const packages = [{ pkgName: 'package-one', pkgVersion: '0.0.1' }];

    const hashResultA = hashBundle(packages, { minify: false });
    const hashResultB = hashBundle(packages, { minify: true });

    expect(hashResultA).to.equal('a821420c7c02f7c125c6d89e5a4ec2733df9d03a7e5efea39ebba2c126257998');
    expect(hashResultB).to.equal('1ba247835242029bceb967a75b623cf8874822bc879da68543ffb7c66997b8dd');

    expect(hashResultA.length).to.equal(64); // length must be < 1024 for AWS S3 keys
  });

  it('should throw if no package name provided', () => {
    const packages = [
      { pkgName: 'package-one', pkgVersion: '0.0.1' },
      { pkgVersion: '0.0.1' },
    ];
    expect(() => (hashBundle(packages))).to.throw();
  });

  it('should throw if no package version provided', () => {
    const packages = [
      { pkgName: 'package-one', pkgVersion: '0.0.1' },
      { pkgName: 'package-two' },
    ];
    expect(() => (hashBundle(packages))).to.throw('pkgName and pkgVersion not supplied for hashing');
  });

  it('should not throw if package list omitted', () => {
    expect(() => (hashBundle(undefined, false))).to.not.throw();
  });

  it('should not throw if build flags obj omitted', () => {
    expect(() => (hashBundle([]))).to.not.throw();
  });

  it('should treat omitted package list as empty array', () => {
    const explicitValue = hashBundle([]);
    expect(hashBundle()).to.equal(explicitValue);
  });

  it('should ignore unknown build flags', () => {
    const explicitValue = hashBundle([], { minify: true });
    expect(hashBundle([], { minify: true, extraneousKey: true })).to.equal(explicitValue);
  });

  it('should treat omitted build flags obj as obj with default vals', () => {
    const explicitValue = hashBundle([], { minify: false });
    expect(hashBundle([])).to.equal(explicitValue);
  });

  it('should treat truthy flags as boolean true', () => {
    const explicitValue = hashBundle([], { minify: true });
    expect(hashBundle([], { minify: 1 })).to.equal(explicitValue);
  });

  it('should treat falsy flags as boolean false', () => {
    const explicitValue = hashBundle([], { minify: false });
    expect(hashBundle([], { minify: 0 })).to.equal(explicitValue);
  });
});
