var fs = require('fs');
var httpLogger = require('morgan');
var winston = require('winston');
var dateUtil = require('../utils/date');

try {
  fs.statSync("./logs");
} catch(e) {
  fs.mkdirSync("./logs");
}

//simple http logger
httpLogger.token('simpleDate', function (req, res) {
  return dateUtil.simpleDate();
});
var httpLoggerFormat = '[:simpleDate] :method :url :status :response-time ms';

//default app logger
var loggerDate = function() {
  return ['[', dateUtil.simpleDate() , ']'].join('');
};

var myLogger = new (winston.Logger)({
  transports: getLoggerTransports('default-logger', 'app')
});
myLogger.httpLogger = httpLogger(httpLoggerFormat);

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

