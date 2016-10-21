import AWS from 'aws-sdk';

// first option is micros, second option is fallback
const S3_BUCKET = process.env.S3_CACHE_BUCKET_NAME || process.env.FROG_S3_CACHE_BUCKET_NAME;
const S3_REGION = process.env.S3_CACHE_BUCKET_REGION || process.env.FROG_S3_CACHE_BUCKET_REGION;
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID || process.env.FROG_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY || process.env.FROG_SECRET_ACCESS_KEY;

function newS3() {
  return new AWS.S3({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: S3_REGION,
  });
}

function upload(filename, contents) {
  return new Promise((resolve, reject) => {
    newS3().putObject({
      Bucket: S3_BUCKET,
      Key: filename,
      Body: contents,
    }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      console.log('s3:upload', filename, err, data); // eslint-disable-line
      resolve();
    });
  });
}

function download(filename) {
  return new Promise((resolve, reject) => {
    newS3().getObject({
      Bucket: S3_BUCKET,
      Key: filename,
    }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      console.log('s3:download', filename, err); // eslint-disable-line
      resolve(data.Body.toString('utf-8'));
    });
  });
}

export { upload, download };
