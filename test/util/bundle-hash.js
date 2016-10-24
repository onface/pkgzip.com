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

    expect(hashResultA).to.equal('032d2581264e0351bb6d9d784f637edbd1133c4cab87cfa636469df2d5f8a54f');
    expect(hashResultB).to.equal('9766a4e8a97b523650ab8552d88cdbb4cd300bdc6a87ad41e1529e24bb77124c');
    expect(hashResultC).to.equal('27388f5189eeeeb447087454975dbb15fd38c4a0683cd73fcac495f98f06b457');
    expect(hashResultD).to.equal('cc16ac1a570685029e57603e41990357e96c78d05cb5e2ae88dc744cfe00d89d');

    expect(hashResultA.length).to.equal(64); // length must be < 1024 for AWS S3 keys
  });

  it('should update hash based on build flags array', () => {
    const packages = [{ pkgName: 'package-one', pkgVersion: '0.0.1' }];

    const hashResultA = hashBundle(packages, { minify: false });
    const hashResultB = hashBundle(packages, { minify: true });

    expect(hashResultA).to.equal('4f27c03f0c37f504964bd96ee4a3408a1eeefc79715a6615e29acc87bc3eebac');
    expect(hashResultB).to.equal('032d2581264e0351bb6d9d784f637edbd1133c4cab87cfa636469df2d5f8a54f');

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
