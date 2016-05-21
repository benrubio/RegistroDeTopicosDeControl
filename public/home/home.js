'use strict';

angular.module('RegistroDeTopicosDeControl.Home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', '$location', 'projects', function($scope, $location, projects) {
  projects.bit = 'hello';
  $scope.projects = projects.load(function (list) {
    if (list.length === 0) {
      projects.create({}, function (project) {
        $location.path('/projects/' + project.id);  
      });
    }
  });
}]);