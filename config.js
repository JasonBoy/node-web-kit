/**
 * Load app configurations
 */

var fs = require('fs');
var configPath = './config.json';
var configInfo = {};
try {
  fs.statSync(configPath);
} catch (e) {
  fs.writeFileSync(configPath, fs.readFileSync(configPath + '.sample'));
  console.log('creating config file finished');
} finally {
  configInfo = JSON.parse(fs.readFileSync(configPath));
}

function getConfigProperty(key) {
  var valueFormEnv = process.env[key];
  if(valueFormEnv) {
    return valueFormEnv;
  }
  return configInfo[key];
}

module.exports = {
  getListeningPort: function() {
    return getConfigProperty('NODE_PORT');
  },
  getNodeEnv: function() {
    return getConfigProperty('NODE_ENV');
  },
  isDevMode: function() {
    var env = getConfigProperty('NODE_ENV');
    return 'dev' === env || 'development' === env;
  },
  isProdMode: function() {
    var env = getConfigProperty('NODE_ENV');
    return 'prod' === env || 'production' === env;
  },
  isNodeProxyEnabled: function() {
    return !!getConfigProperty('NODE_PROXY');
  },
  getStaticAssetsEndpoint: function() {
    //AKA, get CDN domain
    return getConfigProperty('STATIC_ENDPOINT');
  },
  getApiEndPoints: function () {
    return getConfigProperty('API_ENDPOINTS');
  },
  getProxyDebugLevel: function() {
    return getConfigProperty('PROXY_DEBUG_LEVEL');
  },
  getEnv: function(key) {
    return getConfigProperty(key);
  }
};
