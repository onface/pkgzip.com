import AWS from 'aws-sdk';
import { TIMER_S3_UPLOAD, TIMER_S3_DOWNLOAD } from './timer-keys';

// first option is micros, second option is fallback
const S3_BUCKET = process.env.S3_CACHE_BUCKET_NAME || process.env.FROG_S3_CACHE_BUCKET_NAME;
const S3_REGION = process.env.S3_CACHE_BUCKET_REGION || process.env.FROG_S3_CACHE_BUCKET_REGION;
const S3_BUCKET_PATH = process.env.S3_CACHE_BUCKET_PATH || '';
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID || process.env.FROG_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY || process.env.FROG_SECRET_ACCESS_KEY;

// Micros auto-authenticates with S3 so only need to pass auth locally
function s3Config() {
  return process.env.S3_CACHE_BUCKET_NAME
    ? {
      region: S3_REGION,
    }
    : {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
      region: S3_REGION,
    };
}

function newS3() {
  const config = s3Config();
  return new AWS.S3(config);
}

function pathify(filename) {
  return `${S3_BUCKET_PATH}/${filename}`;
}

function upload(filename, contents) {
  console.time(TIMER_S3_UPLOAD); // eslint-disable-line no-console
  return new Promise((resolve, reject) => {
    newS3().putObject({
      Bucket: S3_BUCKET,
      Key: pathify(filename),
      Body: contents,
    }, (err) => {
      console.timeEnd(TIMER_S3_UPLOAD); // eslint-disable-line no-console
      if (err) {
        console.log(`Got error uploading '${filename}' to S3. ${JSON.stringify(err)}`); // eslint-disable-line no-console
        reject(err);
        return;
      }
      console.log(`Uploaded '${filename}' to S3`); // eslint-disable-line no-console
      resolve();
    });
  });
}

function download(filename) {
  console.time(TIMER_S3_DOWNLOAD); // eslint-disable-line no-console
  return new Promise((resolve, reject) => {
    newS3().getObject({
      Bucket: S3_BUCKET,
      Key: pathify(filename),
    }, (err, data) => {
      console.timeEnd(TIMER_S3_DOWNLOAD); // eslint-disable-line no-console
      if (err) {
        console.log(`No cache found for '${filename}'`); // eslint-disable-line no-console
        reject(err);
        return;
      }
      console.log(`Downloaded cached '${filename}' from S3`, filename, err); // eslint-disable-line no-console
      resolve(data.Body.toString('utf-8'));
    });
  });
}

export { upload, download };
