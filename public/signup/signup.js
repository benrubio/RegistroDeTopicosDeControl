'use strict';

angular.module('RegistroDeTopicosDeControl.SignUp', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/signup', {
    templateUrl: 'signup/signup.html',
    controller: 'SignUpCtrl'
  });
}])

.controller('SignUpCtrl', ['$scope', function($scope) {
  $scope.someVariable = {display_name:'Hello World.'};
}]);