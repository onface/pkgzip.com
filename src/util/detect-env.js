function detectEnv(path) {
  const allowedEnvs = ['dev', 'production'];
  const matchedEnv = allowedEnvs.find(env => path.indexOf(`/${env}/`) === 0);
  if (matchedEnv) {
    return matchedEnv;
  }
  return '';
}

export default detectEnv;
