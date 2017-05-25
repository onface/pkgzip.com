// @flow
/* eslint-disable no-console */

export default function log(msg: string | Object) {
  console.log(typeof msg === 'string' ? msg : JSON.stringify(msg));
}
