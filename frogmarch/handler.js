'use strict';

var _lambda = require('./dist/modules/lambda');

var _lambda2 = _interopRequireDefault(_lambda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports.hello = function (event, context, callback) {
  // const packagesQuery = event.queryStringParameters.packages;
  function respond(message) {
    var response = {
      statusCode: 200,
      body: JSON.stringify({
        message: message,
        input: event
      })
    };

    callback(null, response);
  }

  // respond('IT WORKED!');
  (0, _lambda2.default)({}, [{ pkgName: 'ak-button', pkgVersion: '1.0.0' }]).then(function (result) {
    respond(result);
  }).catch(function (err) {
    respond(err);
  });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
