const allowedEnvs = ['dev', 'production'];

export default allowedEnvs;

export function isEnvAllowed(env) {
  return allowedEnvs.includes(env);
}
