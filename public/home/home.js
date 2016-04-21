'use strict';

angular.module('RegistroDeTopicosDeControl.Home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', '$location', 'Projects', function($scope, $location, Projects) {
  $scope.someVariable = Projects.query(function(value, responseHeaders) {
    if (value.length == 0) {
      console.log('need to redirect');
    }
  },
  function (httpResponse) {
    console.log(httpResponse);
    if (httpResponse.status === 401) {
      console.log('Go sign in');
      $location.path('/signup');
    }
  });
}]);