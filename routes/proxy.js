/**
 * Request proxy for backend api
 */

var express = require('express')
  ;
var router = express.Router();

var apiProxy = require('../api/api-proxy');

//common proxy for other api requests
router.use(function(req, res) {
  apiProxy.proxyRequest(req, res, true);
});

module.exports = router;