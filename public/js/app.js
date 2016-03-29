var angular = require('angular');
var utils = require('./utils');

angular.module('app', [])
  .controller('Demo1', ['$scope', function ($scope) {
    $scope.date = utils.showTime();
    console.log('demo1');
  }])
  .controller('Demo2', ['$scope', function ($scope) {
    console.log('demo2');
  }]);