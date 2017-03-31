/* eslint import/no-extraneous-dependencies: 0 */

import chai from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

const expect = chai.expect;

describe('buildEntryFile()', () => {
  let buildEntryFile;
  let fsWriteSpy;

  beforeEach(() => {
    fsWriteSpy = sinon.spy();
    buildEntryFile = proxyquire('../../../src/util/entry-file', {
      fs: { writeFileSync: fsWriteSpy },
    });
  });

  it('should prepend output with comment indicating package names', () => {
    buildEntryFile({
      entryFilePath: '',
      allPkgNames: ['left-pad'],
    });
    expect(fsWriteSpy.calledWith('', "window.pkgzip = {}; \nwindow.pkgzip['left-pad'] = require('left-pad');")).to.equal(true);
  });

  it('should support scoped package names', () => {
    buildEntryFile({
      entryFilePath: 'output-file.js',
      allPkgNames: ['left-pad', '@atlaskit/button'],
    });
    expect(fsWriteSpy.calledWith('output-file.js', "window.pkgzip = {}; \nwindow.pkgzip['left-pad'] = require('left-pad');\nwindow.pkgzip['@atlaskit/button'] = require('@atlaskit/button');")).to.equal(true);
  });

  it('should still return if empty packages array supplied', () => {
    buildEntryFile({
      entryFilePath: '',
      allPkgNames: [],
    });
    expect(fsWriteSpy.calledWith('', 'window.pkgzip = {}; ')).to.equal(true);
  });

  it('should still return if no packages array supplied', () => {
    buildEntryFile({
      entryFilePath: '',
    });
    expect(fsWriteSpy.calledWith('', 'window.pkgzip = {}; ')).to.equal(true);
  });
});
