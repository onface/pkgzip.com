/* eslint import/no-extraneous-dependencies: 0 */

import chai from 'chai';
import decorateResults from '../../../src/util/decorate-results';

const expect = chai.expect;

describe('decorateResults()', () => {
  it('should prepend output with comment indicating package names', () => {
    expect(decorateResults(['my-pkg'], '// webpack code')).to.equal(`
console.warn("END OF LIFE NOTICE: PKGZIP SERVICE IS DEPRECATED AND WILL STOP WORKING ON JANUARY 1 2018. THANK YOU FOR USING PKGZIP, BUT WE ARE SWITCHING IT OFF AS THERE ARE MUCH BETTER TOOLS OUT THERE NOW, SUCH AS THE AWESOME CODESANDBOX.IO");

// The following objects are now available!:

// window.pkgzip['my-pkg']

// ============
// webpack code`);
  });

  it('should support multiple packages including scope', () => {
    expect(decorateResults(['my-pkg', '@atlassian/my-button'], '// webpack code')).to.equal(`
console.warn("END OF LIFE NOTICE: PKGZIP SERVICE IS DEPRECATED AND WILL STOP WORKING ON JANUARY 1 2018. THANK YOU FOR USING PKGZIP, BUT WE ARE SWITCHING IT OFF AS THERE ARE MUCH BETTER TOOLS OUT THERE NOW, SUCH AS THE AWESOME CODESANDBOX.IO");

// The following objects are now available!:

// window.pkgzip['my-pkg']
// window.pkgzip['@atlassian/my-button']

// ============
// webpack code`);
  });

  it('should return empty if no results provided', () => {
    expect(decorateResults(['my-pkg'])).to.equal(undefined);
  });
});
