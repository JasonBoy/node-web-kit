/**
 * proxy request to backend
 */

var request = require('request')
  , _ = require('underscore')
  , Promise = require('bluebird')
  ;

var logger = require('../mw/logger').defaultLogger
  , appConfig = require('../config')
  ;

if(appConfig.isDevMode()) {
  request.debug = true;
  //require('request-debug')(request);
}
var proxyPath = appConfig.getProxyAddress();

exports.proxyRequest = function(req, res, noPromise, options) {
  return new Promise(function (resolve, reject) {
    var apiRequest = req.pipe(request(getProxyOptions(req, options), function(err, response, body) {
      if(!noPromise) {
        if(err || response.statusCode != 200) {
          reject(response ? response : {statusCode: 500});
        } else {
          resolve(body);
        }
      }
      if(err) {
        logger.error(err);
      }
    }));
    if(noPromise) {
      apiRequest.pipe(res);
    }
  });
};

function getProxyOptions(req, options) {
  var defaultOptions = {
    url: req.url,
    baseUrl: proxyPath,
    method: req.method,
    json: true,
    gzip: true
  };
  if(!_.isEmpty(options)) {
    defaultOptions = _.extend({}, options, defaultOptions);
  }
  return defaultOptions;
}