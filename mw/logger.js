var fs = require('fs');
var winston = require('winston');
var winstonDaily = require('winston-daily-rotate-file');
var expressWinston = require('express-winston');
var dateUtil = require('../utils/date');
var path = require("path");
var config = require('../config');


try {
  fs.statSync("./logs");
} catch(e) {
  fs.mkdirSync("./logs");
}

//default app logger
var loggerDate = function() {
  return ['[', dateUtil.simpleDate() , ']'].join('');
};

var myLogger = new (winston.Logger)({
  transports: getLoggerTransports('default-logger', 'app')
});

myLogger.expressHttpLogger = getHttpExpressLogger();

module.exports = myLogger;

function getLoggerTransports(name, filename) {
  var loggerTransports = [
    new (winston.transports.File)({
      name: name,
      filename: './logs/' + filename + '.log',
      level: "info",
      maxsize: "5242880", //5MB
      maxFiles: 50,
      tailable: true,
      timestamp: loggerDate
    }),
    new (winston.transports.File)({
      name: name + '-error',
      filename: './logs/' + filename + '-err.log',
      level: "error",
      maxsize: "2097152", //2MB
      maxFiles: 50,
      tailable: true,
      timestamp: loggerDate,
      handleExceptions: true,
      humanReadableUnhandledException: true
    })
  ];
  //if(config.isDevMode()) {
  loggerTransports.push(new (winston.transports.Console)({
    colorize: true,
    timestamp: loggerDate,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    level: 'debug'
  }));
  //}
  return loggerTransports;
}
function getHttpExpressLogger() {
  var requestLoggerTransports = [
    new (winstonDaily)({
      name: 'access-log',
      filename: path.join('./logs', 'access.log'),
      level: "info",
      tailable: true
    }),
    new winston.transports.Console({
      colorize: true,
      timestamp: function () {
        return ['[', dateUtil.simpleDate(), ']'].join('');
      }
    })
  ];

  var requestLoggerConfig = {
    transports: requestLoggerTransports,
    meta: false,
    msg: '[{{req.ip}}] {{req.method}} {{req.originalUrl}} {{res.statusCode}} {{res.responseTime}}ms',
    expressFormat: config.isDevMode(),
    colorStatus: config.isDevMode(),
    statusLevels: true,
    level: config.isDevMode() ? 'debug' : 'info'
  };
  return expressWinston.logger(requestLoggerConfig);
}

