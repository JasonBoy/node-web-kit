/**
 * proxy request to backend
 */

var request = require('request')
  , _ = require('lodash')
  , Promise = require('bluebird')
  ;

var logger = require('../mw/logger')
  , appConfig = require('../config')
  ;

var debugLevel = appConfig.getProxyDebugLevel();

if(debugLevel && debugLevel > 0) {
  if(debugLevel >= 1) request.debug = true;
  if(debugLevel >= 2) require('request-debug')(request);
}

/**
 * Dispatch the api requests
 * @param req
 * @param res
 * @param noPromise
 * @param apiEndpoint
 * @param options
 */
exports.proxyRequest = function(req, res, noPromise, apiEndpoint, options) {
  return new Promise(function (resolve, reject) {
    var apiRequest = req.pipe(request(getProxyOptions(req, apiEndpoint, options), function(err, response, body) {
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

function getProxyOptions(req, apiEndPoint, options) {
  var defaultOptions = {
    url: req.url,
    baseUrl: apiEndPoint ? apiEndPoint : '',
    method: req.method,
    json: true,
    gzip: true
  };
  if(!_.isEmpty(options)) {
    defaultOptions = _.extend(defaultOptions, options);
  }
  return defaultOptions;
}
