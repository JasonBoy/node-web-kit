var request = require('supertest');
var express = require('express');
var rewire = require('rewire');
var assert = require('chai').assert;
var apiProxy = rewire('../api/api-proxy');

var generateOptions = apiProxy.__get__('getProxyOptions');

var app = express();

app.get('/proxy-options', function (req, res) {
  var options = generateOptions(req, '', {
    qs: req.query,
    headers: {
      'Test-Header': req.get('Test-Header')
    }
  });
  // console.log(options);
  res.status(200).json(options);
});

describe('GET /proxy-options', function() {
  it('respond with json with specified options', function(done) {
    request(app)
      .get('/proxy-options?query=test')
      .set('Accept', 'application/json')
      .set('Test-Header', 'application/test')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if(err) done(err);
        var body = res.body;
        if(body.qs.query === 'test' && body.headers['Test-Header'] === 'application/test') {
          done();
          return;
        }
        done(new Error('response does not contain specified data!'));
      });
  });
});
