/* eslint import/no-extraneous-dependencies: 0 */

import chai from 'chai';
import hashBundle from '../../../src/util/bundle-hash';

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

    expect(hashResultA).to.not.equal(hashResultB);
    expect(hashResultB).to.not.equal(hashResultC);
    expect(hashResultC).to.not.equal(hashResultD);

    expect(hashResultA.length).to.equal(64); // length must be < 1024 for AWS S3 keys
  });

  it('should update hash based on build flags array', () => {
    const packages = [{ pkgName: 'package-one', pkgVersion: '0.0.1' }];

    const hashResultA = hashBundle(packages, { minify: false });
    const hashResultB = hashBundle(packages, { minify: true });
    const hashResultC = hashBundle(packages, { minify: true, dedupe: true });

    expect(hashResultA).to.not.equal(hashResultB);
    expect(hashResultB).to.not.equal(hashResultC);

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
