'use strict';

/* Services */

var topicosServices = angular.module('topicosServices', ['ngResource', 'ngCookies']);

topicosServices.factory('Echo', ['$resource', '$cookies',
  function($resource, $cookies){
    return $resource('http://localhost:8000/echo', {}, {
      query: {
		  method:'GET',
		  headers: { 'gtoken': $cookies.get('gtoken') }
	  }
    });
  }]);