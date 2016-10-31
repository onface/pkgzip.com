import bundleFn from './dist/modules/lambda';

module.exports.hello = (event, context, callback) => {
  // const packagesQuery = event.queryStringParameters.packages;
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

  // respond('IT WORKED!');
  bundleFn({}, [{ pkgName: 'ak-button', pkgVersion: '1.0.0' }]).then((result) => {
    respond(result);
  }).catch((err) => {
    respond(err);
  });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
