/**
 * Created by jason on 12/15/15.
 */

var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var swig = require('swig');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

var appConfig = require('./config');

var logger = require('./mw/logger').defaultLogger;
var apiProxyRouter = require('./routes/proxy');


function init(moduleName, moduleLogger) {
  moduleLogger && (logger = moduleLogger);
  var app = express();
  //set app env
  app.set('isProdMode', appConfig.isProdMode());
  app.set('isDevMode', appConfig.isDevMode());
  app.set('proxyEnabled', appConfig.isNodeProxyEnabled());
  app.set('proxyPath', appConfig.getProxyPath());

  swig.setDefaults({
    varControls: ['{=', '=}'],
    cache: appConfig.isDevMode() ? false : 'memory'
  });
  app.set('views', path.join(__dirname, 'views'));
  // view engine setup
  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');

  app.use(require('./mw/logger').httpLogger);
  //nginx may do this
  app.use(compression({}));
  // uncomment after placing your favicon in /public
  app.use(favicon(path.join(__dirname, 'public', 'img/favicon.ico')));
  app.use('/public', express.static(path.join(__dirname, 'public/build'), {maxAge: appConfig.isDevMode() ? 0 : 2592000000}));
  app.use('/public', express.static(path.join(__dirname, 'public'), {maxAge: appConfig.isDevMode() ? 0 : 2592000000}));

  app.use(cookieParser());
  app.use(session({name: "sid", secret: 'node.web.'+ (moduleName ? moduleName + '.' : '') +'sid', saveUninitialized: true, resave: true}));

  //api proxy
  if(appConfig.getProxyPath()) {
    app.use(appConfig.getProxyPath(), apiProxyRouter);
    logger.info('Node proxy[' + appConfig.getProxyAddress() + '] enabled for path: ' + appConfig.getProxyPath());
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
