/* eslint import/no-extraneous-dependencies: 0 */

import chai from 'chai';
import decorateResults from '../../src/util/decorate-results';

const expect = chai.expect;

describe('decorateResults()', () => {
  it('should prepend output with comment indicating package names', () => {
    expect(decorateResults(['my-pkg'], '// webpack code')).to.equal(`// The following objects are now available!:

// window.pkgzip['myPkg']

// ============
// webpack code`);
  });

  it('should support multiple packages including scope', () => {
    expect(decorateResults(['my-pkg', '@atlassian/button'], '// webpack code')).to.equal(`// The following objects are now available!:

// window.pkgzip['myPkg']
// window.pkgzip['@atlassian/button']

// ============
// webpack code`);
  });

  it('should return empty if no results provided', () => {
    expect(decorateResults(['my-pkg'])).to.equal(undefined);
  });
});
