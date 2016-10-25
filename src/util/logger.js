/* eslint-disable no-console */

export default function log(msg) {
  console.log(typeof msg === 'string' ? msg : JSON.stringify(msg));
}
