'use strict';

/* Services */

var topicosServices = angular.module('topicosServices', ['ngResource', 'ngCookies']);

topicosServices.factory('projects', ['$resource', '$cookies',
  function projectsFactory($resource, $cookies){
    var resource, gTokenGetter, count, load, projectList = [], that = { };

    gTokenGetter = function() {
      return $cookies.get('gtoken');
    }
    
    resource = $resource('/projects', {}, {
      query: {
		  method:'GET',
		  headers: { 'gtoken': gTokenGetter },
          isArray: true
	  }
    });
    
    load = function () {
      projectList = resource.query(function success (value, responseHeaders) {
        
      },
      function error (httpResponse) {
        
      });
      
      that.list = projectList;
    };
    
    that.load = load;
    
    that.list = projectList;
    
    return that;
  }]);