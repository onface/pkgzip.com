/* eslint import/no-extraneous-dependencies: 0 */

import chai from 'chai';
import hashBundle from '../../src/util/bundle-hash';

const expect = chai.expect;

describe('hashBundle()', () => {
  it('should hash based on packages array and minifed flag', () => {
    const expectations = [
      [
        [
          { pkgName: 'package-one', pkgVersion: '0.0.1' },
        ],
        false,
        '7cd906443e1236f5c4517b5dd7f3fb667fcaec7b88c1f4bbdeacbfef6cc5e58b',
      ],
      [
        [
          { pkgName: 'package-one', pkgVersion: '0.0.2' },
        ],
        false,
        '2e3fc7e10f4eb49aa64f860fcaad35c01b711b6ef08028d210536fc59379711e',
      ],
      [
        [
          { pkgName: 'package-one', pkgVersion: '0.0.1' },
          { pkgName: 'package-two', pkgVersion: '0.0.1' },
        ],
        false,
        'ecee67c62e0d64dfa19bd2125054e95d014a1fa263dcbc729d2c36dd4dd81069',
      ],
      [
        [
          { pkgName: 'package-one', pkgVersion: '0.0.1' },
        ],
        true,
        '0581393ed7fcce79961d1c428bcf39c0166f6bdb58c1cd22a551d670fff02709',
      ],
      [
        [
          { pkgName: 'package-one', pkgVersion: '0.0.2' },
        ],
        true,
        '25ddb4ccc3f4c4609d3f064b7303623577aa7d549bc9089bb6a806802987cec4',
      ],
      [
        [
          { pkgName: 'package-one', pkgVersion: '0.0.1' },
          { pkgName: 'package-two', pkgVersion: '0.0.1' },
        ],
        true,
        '3fcbcb7fa7cc49caa39ec6ffc74bf8f43733a5091a05f78dcc63d9a7e95c206e',
      ],
    ];

    expectations.forEach((ex) => {
      const hash = hashBundle(ex[0], ex[1]);
      expect(hash).to.equal(ex[2]);
      expect(hash.length).to.equal(64); // length must be < 1024 for AWS S3 keys
    });
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

  it('should not throw if minified flag is omitted', () => {
    expect(() => (hashBundle([]))).to.not.throw();
  });

  it('should treat omitted package list as empty array', () => {
    const explicitValue = hashBundle([]);
    expect(hashBundle()).to.equal(explicitValue);
  });

  it('should treat omitted minified flag as false', () => {
    const explicitValue = hashBundle([], false);
    expect(hashBundle([])).to.equal(explicitValue);
  });
});
