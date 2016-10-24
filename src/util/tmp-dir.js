import tmp from 'tmp';

// create a temp dir
function tmpDir() {
  return new Promise((resolve, reject) => {
    tmp.dir((err, path) => {
      if (err) {
        console.log(`Error trying to get new tmp dir '${err}'`); // eslint-disable-line no-console
        reject(err);
        return;
      }
      console.log(`Created new tmp dir at '${path}'`); // eslint-disable-line no-console
      resolve(path);
    });
  });
}

export default tmpDir;
