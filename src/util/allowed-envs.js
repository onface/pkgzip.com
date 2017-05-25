// @flow

const allowedEnvs = ['dev', 'production'];

export default allowedEnvs;

export function isEnvAllowed(env: string) {
  return allowedEnvs.includes(env);
}
