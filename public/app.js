/*jslint node:true*/
'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('RegistroDeTopicosDeControl', [
  'ngRoute',
  'ngCookies',
  'RegistroDeTopicosDeControl.Home',
  'RegistroDeTopicosDeControl.Project',
  'RegistroDeTopicosDeControl.SignUp',
  'topicosServices'
]);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
