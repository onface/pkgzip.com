import request from 'request';

const randomPort = process.env.SERVERLESS_TEST_PORT;

const getEndpoint = endpoint => (
  new Promise((resolve, reject) => {
    request({
      url: `http://localhost:${randomPort}${endpoint}`,
      followRedirect: false,
    }, (err, response, body) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({ response, body });
    });
  })
);

export default getEndpoint;
