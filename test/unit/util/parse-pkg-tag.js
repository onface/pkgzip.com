/* eslint import/no-extraneous-dependencies: 0 */

import chai from 'chai';
import parsePkgTag from '../../../src/util/parse-pkg-tag';

const expect = chai.expect;

describe('parsePkgTag()', () => {
  it('should return null for bad input', () => {
    expect(parsePkgTag('')).to.equal(null);
    expect(parsePkgTag('@')).to.equal(null);
  });

  it('should handle unscoped packages without version', () => {
    expect(parsePkgTag('ak-button')).to.deep.equal({
      pkgName: 'ak-button',
      pkgVersion: undefined,
    });
  });

  it('should handle unscoped packages with version', () => {
    expect(parsePkgTag('ak-button@^1.2.3')).to.deep.equal({
      pkgName: 'ak-button',
      pkgVersion: '^1.2.3',
    });
  });

  it('should handle scoped packages without version', () => {
    expect(parsePkgTag('@atlaskit/button')).to.deep.equal({
      pkgName: '@atlaskit/button',
      pkgVersion: undefined,
    });
  });

  it('should handle scoped packages with version', () => {
    expect(parsePkgTag('@atlaskit/button@^3.2.1')).to.deep.equal({
      pkgName: '@atlaskit/button',
      pkgVersion: '^3.2.1',
    });
  });
});
