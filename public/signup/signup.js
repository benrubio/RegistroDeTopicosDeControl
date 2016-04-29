'use strict';

angular.module('RegistroDeTopicosDeControl.SignUp', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/signup', {
    templateUrl: 'signup/signup.html',
    controller: 'SignUpCtrl'
  });
}])

.controller('SignUpCtrl', ['$scope', 'projects', function($scope, projects) {
  $scope.projects = projects.load(function () { });
  
}]);