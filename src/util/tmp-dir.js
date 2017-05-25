// @flow

import tmp from 'tmp';
import log from './logger';

// create a temp dir
function tmpDir(): Promise<any> {
  return new Promise((resolve, reject) => {
    tmp.dir((err, path: string) => {
      if (err) {
        log(`Error trying to get new tmp dir '${err}'`);
        reject(err);
        return;
      }
      log(`Created new tmp dir at '${path}'`);
      resolve(path);
    });
  });
}

export default tmpDir;
