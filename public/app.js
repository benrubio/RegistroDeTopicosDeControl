/*jslint node:true*/
'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('RegistroDeTopicosDeControl', [
  'ngRoute',
  'ngCookies',
  'RegistroDeTopicosDeControl.SignUp',
  'topicosServices'
]);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/signup'});
}]);
