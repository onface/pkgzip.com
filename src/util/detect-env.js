import allowedEnvs from './allowed-envs';

function detectEnv(path) {
  const matchedEnv = allowedEnvs.find(env => path.indexOf(`/${env}/`) === 0);
  if (matchedEnv) {
    return matchedEnv;
  }
  return '';
}

export default detectEnv;
