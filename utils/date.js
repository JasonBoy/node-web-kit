var dateFormat = require('dateformat');

module.exports = {
  simpleDate: function() {
    return dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
  }
};

