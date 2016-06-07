/**
 * app initialization
 */

var myApp = require('./app-common');

var app = myApp.init('myApp', require('./mw/logger').defaultLogger);
//add module specific routes
app.get('/', function(req, res) {
  res.render("index");
});

myApp.handleCommonError(app);

module.exports = app;
