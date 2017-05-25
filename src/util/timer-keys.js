// @flow

/* eslint-disable no-console */

export const TIMER_YARN_INSTALL_TOTAL = 'total yarn install time';
export const TIMER_WEBPACK_EXECUTION = 'total webpack execution time';
export const TIMER_S3_DOWNLOAD = 's3 download duration';
export const TIMER_S3_UPLOAD = 's3 upload duration';
export const TIMER_VERSION_EXPANSION_TOTAL = 'total version expansion time (all pkgs)';
export const TIMER_BUNDLE_REQUEST_DURATION = 'total bundle request time';

export function timeStart(key: string) {
  console.time(key);
}

export function timeEnd(key: string) {
  console.timeEnd(key);
}
