/* eslint import/no-extraneous-dependencies: 0 */

import chai from 'chai';
import allowedEnvs, { isEnvAllowed } from '../../../src/util/allowed-envs';

const expect = chai.expect;

describe('allowedEnvs()', () => {
  it('default export should be array of envs', () => {
    expect(allowedEnvs).to.deep.equal(['dev', 'production']);
  });

  it('isEnvAllowed function should return true for valid envs', () => {
    expect(isEnvAllowed('dev')).to.equal(true);
    expect(isEnvAllowed('production')).to.equal(true);
  });

  it('isEnvAllowed function should return false for invalid envs', () => {
    expect(isEnvAllowed('')).to.equal(false);
    expect(isEnvAllowed()).to.equal(false);
    expect(isEnvAllowed('staging')).to.equal(false);
  });
});
