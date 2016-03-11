'use strict';

angular.module('RegistroDeTopicosDeControl.Home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', 'Projects', function($scope, Projects) {
  $scope.someVariable = Projects.query(function(value, responseHeaders) {
    if (value.length == 0) {
      console.log('need to redirect');
    }
  });
}]);