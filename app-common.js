/**
 * App common stuff
 */

var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var nunjucks = require('nunjucks');
var cons = require('consolidate');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var _ = require('lodash');

var appConfig = require('./config');
var apiEndPoints = appConfig.getApiEndPoints();

var logger = require('./mw/logger');
var apiProxyRouter = require('./routes/proxy');


function init(moduleName, moduleLogger) {
  moduleLogger && (logger = moduleLogger);
  var app = express();
  //set app env
  app.set('isProdMode', appConfig.isProdMode());
  app.set('isDevMode', appConfig.isDevMode());
  app.set('proxyEnabled', appConfig.isNodeProxyEnabled());
  app.set('proxyPaths', apiEndPoints);

  var viewsPath = appConfig.isDevMode() ? 'views' : 'build/views';

  //TODO: Change the code here if you want to use other extensions and template engines
  app.set('view engine', 'html');
  cons.requires.nunjucks = nunjucks.configure(viewsPath, {
    autoescape: true,
    express: app,
    noCache: appConfig.isDevMode()
  });

  app.use(require('./mw/logger').expressHttpLogger);
  //nginx may do this
  app.use(compression({}));
  // uncomment after placing your favicon in /public
  app.use(favicon(path.join(__dirname, 'public', 'img/favicon.ico')));
  app.use('/public', express.static(path.join(__dirname, 'build/content'), {maxAge: appConfig.isDevMode() ? 0 : 2592000000}));
  app.use('/public', express.static(path.join(__dirname, 'public'), {maxAge: appConfig.isDevMode() ? 0 : 2592000000}));

  app.use(cookieParser());
  app.use(session({name: "sid", secret: 'node.web.'+ (moduleName ? moduleName + '.' : '') +'sid', saveUninitialized: true, resave: true}));

  //api proxy
  if(!_.isEmpty(apiEndPoints)) {
    for(var prefix in apiEndPoints) {
      if(apiEndPoints.hasOwnProperty(prefix)) {
        var endPoint = apiEndPoints[prefix];
        app.use(prefix, apiProxyRouter.handleApiRequests(endPoint));
        logger.info('Node proxy[' + endPoint + '] enabled for path: ' + prefix);
      }
    }
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  return app;
}

module.exports = {
  init: init,
  handleCommonError: function(app) {
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });
    // error handlers
    // development error handler
    // will print stacktrace
    if (appConfig.isDevMode()) {
      app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send(err);
      });
    }
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.send(err.message);
    });
  }
};
