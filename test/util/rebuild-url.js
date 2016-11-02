/* eslint import/no-extraneous-dependencies: 0 */

import chai from 'chai';
import rebuildUrl from '../../src/util/rebuild-url';

const expect = chai.expect;

describe('rebuildUrl()', () => {
  describe('build flags', () => {
    it('should handle minify flag', () => {
      const packages = [];
      const buildFlags = { minify: true, dedupe: false };
      expect(rebuildUrl(packages, buildFlags)).to.equal('/dev/bundle.js?packages=&flags=minify');
    });

    it('should enable minify regardless, if dedupe flag is enabled', () => {
      const packages = [];
      const buildFlags = { minify: false, dedupe: true };
      expect(rebuildUrl(packages, buildFlags)).to.equal('/dev/bundle.js?packages=&flags=dedupe,minify');
    });

    it('should support empty build flags', () => {
      const packages = [];
      expect(rebuildUrl(packages, {})).to.equal('/dev/bundle.js?packages=');
    });
  });

  describe('environment', () => {
    it('should use dev env if not passed', () => {
      const packages = [];
      expect(rebuildUrl(packages, {})).to.equal('/dev/bundle.js?packages=');
    });

    it('should use value if passed', () => {
      const packages = [];
      expect(rebuildUrl(packages, {}, 'dev')).to.equal('/dev/bundle.js?packages=');
      expect(rebuildUrl(packages, {}, 'production')).to.equal('/production/bundle.js?packages=');
    });

    it('should fall back to dev if anything other than "dev" or "prod" used', () => {
      const packages = [];
      expect(rebuildUrl(packages, {}, 'x')).to.equal('/dev/bundle.js?packages=');
    });
  });

  describe('expansion', () => {
    it('should expand single package name + version correctly', () => {
      const packages = [{ pkgName: 'ak-button', pkgVersion: 'latest' }];
      expect(rebuildUrl(packages, {})).to.equal('/dev/bundle.js?packages=ak-button');
    });

    it('should expand multiple package names + versions correctly', () => {
      const packages = [
        { pkgName: 'ak-button', pkgVersion: 'latest' },
        { pkgName: 'ak-icon', pkgVersion: '1.x' },
      ];
      expect(rebuildUrl(packages, {})).to.equal('/dev/bundle.js?packages=ak-button,ak-icon@1.x');
    });

    it('should remove @latest from package if latest supplied', () => {
      const packages = [{ pkgName: 'ak-button', pkgVersion: 'latest' }];
      expect(rebuildUrl(packages, {})).to.equal('/dev/bundle.js?packages=ak-button');
    });
  });

  it('should preserve package order', () => {
    const packages = [
      { pkgName: 'ak-zephyr', pkgVersion: 'latest' },
      { pkgName: 'ak-icon', pkgVersion: '1.x' },
      { pkgName: 'ak-button', pkgVersion: 'latest' },
    ];
    expect(rebuildUrl(packages, {})).to.equal('/dev/bundle.js?packages=ak-zephyr,ak-icon@1.x,ak-button');
  });
});
