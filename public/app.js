/*jslint node:true*/
'use strict';

// Declare app level module which depends on views, and components
angular.module('RegistroDeTopicosDeControl', [
  'ngRoute',
  'ngCookies',
  'RegistroDeTopicosDeControl.SignUp',
  'topicosServices'
]).config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/signup'});
}]);
