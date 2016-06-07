/**
 * Request proxy for backend api
 */

var express = require('express');

var apiProxy = require('../api/api-proxy');
var corsConfig = require('../constants').corsConfig;

exports.handleApiRequests = handleApiRequests;

function handleApiRequests(apiEndpoint) {
  var router = express.Router();
  router.use(function (req, res, next) {
    if('OPTIONS' === req.method) {
      res.set(corsConfig.origin.key, req.get('Origin'));
      res.set(corsConfig.method.res, corsConfig.method.value);
      res.set(corsConfig.cache.key, corsConfig.cache.value);
      //res.set(corsConfig.credentials.key, corsConfig.credentials.value);
      if(req.get(corsConfig.header.req)) {
        res.set(corsConfig.header.res, corsConfig.header.value)
      }
      res.end();
      return;
    }
    next();
  });

  //common proxy for other api requests
  router.use(function(req, res) {
    if(req.get('Origin')) {
      res.set(corsConfig.origin.key, req.get('Origin'));
    }
    apiProxy.proxyRequest(req, res, true, apiEndpoint);
  });

  return router;
}