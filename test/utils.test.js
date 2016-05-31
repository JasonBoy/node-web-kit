var assert = require('chai').assert;
var dateUtils = require('../utils/date');
describe('dateUtil', function() {
  describe('#simpleDate()', function() {
    var reg = /^[\d]{4}-[\d]{2}-[\d]{2}\s[\d]{2}:[\d]{2}:[\d]{2}$/;
    it('should return date in format "yyyy-mm-dd HH:MM:ss"', function() {
      assert.equal(true, reg.test(dateUtils.simpleDate()));
    });
  });
});
