
const assert = require('chai').assert;
describe('Array', function() {
  beforeEach(function (done) {
    console.log('starting test...');
    done();
  });
  describe('#indexOf()', function () {
    afterEach(function () {
      console.log('done testing...');
    });
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});