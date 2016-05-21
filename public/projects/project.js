'use strict';

angular.module('RegistroDeTopicosDeControl.Project', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/projects/:projectId', {
    templateUrl: 'projects/project.html',
    controller: 'ProjectCtrl'
  });
}])

.controller('ProjectCtrl', ['$scope', '$location', '$routeParams', 'projects', 
  function($scope, $location, $routeParams, projects) {
    var projectId = $routeParams.projectId;
    $scope.project = projects.loadProject(projectId);
}]);