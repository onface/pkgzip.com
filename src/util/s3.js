import AWS from 'aws-sdk';
import { TIMER_S3_UPLOAD, TIMER_S3_DOWNLOAD, timeStart, timeEnd } from './timer-keys';
import log from './logger';

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
  timeStart(TIMER_S3_UPLOAD);
  return new Promise((resolve, reject) => {
    newS3().putObject({
      Bucket: S3_BUCKET,
      Key: pathify(filename),
      Body: contents,
    }, (err) => {
      timeEnd(TIMER_S3_UPLOAD);
      if (err) {
        log(`Got error uploading '${filename}' to S3. ${JSON.stringify(err)}`);
        reject(err);
        return;
      }
      log(`Uploaded '${filename}' to S3`);
      resolve();
    });
  });
}

function download(filename) {
  timeStart(TIMER_S3_DOWNLOAD);
  return new Promise((resolve, reject) => {
    newS3().getObject({
      Bucket: S3_BUCKET,
      Key: pathify(filename),
    }, (err, data) => {
      timeEnd(TIMER_S3_DOWNLOAD);
      if (err) {
        log(`No cache found for '${filename}'`);
        reject(err);
        return;
      }
      log(`Downloaded cached '${filename}' from S3`, filename, err);
      resolve(data.Body.toString('utf-8'));
    });
  });
}

export { upload, download };
