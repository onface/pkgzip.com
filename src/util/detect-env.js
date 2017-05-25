// @flow

import allowedEnvs from './allowed-envs';

function detectEnv(path: string) {
  const matchedEnv = allowedEnvs.find(env => path.indexOf(`/${env}/`) === 0);
  if (matchedEnv) {
    return matchedEnv;
  }
  return '';
}

export default detectEnv;
