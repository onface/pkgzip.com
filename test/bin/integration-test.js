/* eslint-disable no-console */

const path = require('path');
const childProcess = require('child_process');

const { exec, spawn } = childProcess;

const slsBin = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'sls');
const randomPort = Math.floor(1000 + (8999 * Math.random()));

exec(`${slsBin} offline --dontPrintOutput --noTimeout --port=${randomPort} --stage=dev`, {
  env: process.env,
}, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});

setTimeout(() => {
  const mocha = spawn('mocha', ['--recursive', '--timeout', '30000', '--compilers', 'js:babel-register', 'test/integration'], {
    env: Object.assign({ SERVERLESS_TEST_PORT: randomPort }, process.env),
  });

  mocha.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  mocha.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  mocha.on('exit', (code) => {
    console.log(`mocha process exited with code ${code.toString()}`);
    process.exit(code);
  });
}, 2000);
