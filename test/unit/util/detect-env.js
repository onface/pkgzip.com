/* eslint import/no-extraneous-dependencies: 0 */

import chai from 'chai';
import detectEnv from '../../../src/util/detect-env';

const expect = chai.expect;

describe('detectEnv()', () => {
  it('should detect valid environments', () => {
    expect(detectEnv('/dev/blah')).to.equal('dev');
    expect(detectEnv('/production/blah')).to.equal('production');
  });

  it('should return empty string for invalid environments', () => {
    expect(detectEnv('//dev/blah')).to.equal('');
    expect(detectEnv('//production/blah')).to.equal('');
    expect(detectEnv('production')).to.equal('');
    expect(detectEnv('')).to.equal('');
    expect(detectEnv('https://webpack.onface.live/dev/blah')).to.equal('');
  });
});
