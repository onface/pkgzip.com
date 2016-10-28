const bundleFn = require('./dist/modules/lambda.js');

module.exports.hello = (event, context, callback) => {
  function respond(message) {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message,
        input: event,
      }),
    };

    callback(null, response);
  }

  bundleFn({}, [{ pkgName: 'ak-button', pkgVersion: '1.0.0' }]).then((result) => {
    respond(result);
  }).catch((err) => {
    respond(err);
  });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
