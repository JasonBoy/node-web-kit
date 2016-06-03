/**
 * app initialization
 */

var myApp = require('./app-common');

var app = myApp.init('myApp', require('./mw/logger').defaultLogger);
//add module specific routes
app.get('/', function(req, res) {
  res.render("index");
});

app.get('/test1', function(req, res) {
  console.log(req.query);
  res.json({result: 'test1'});
});
app.get('/test2', function(req, res) {
  console.log(req.query);
  res.json({result: 'test2'});
});


myApp.handleCommonError(app);

module.exports = app;
