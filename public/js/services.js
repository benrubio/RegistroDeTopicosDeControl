'use strict';

/* Services */

var topicosServices = angular.module('topicosServices', ['ngResource', 'ngCookies']);

topicosServices.factory('projects', ['$resource', '$cookies',
  function projectsFactory($resource, $cookies){
    var resource, gTokenGetter, loaded, load, reload, projectList = [], that = { };

    loaded = false;
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
    
    load = function (success) {
      if (!loaded) {
        projectList = resource.query(function successResponse (value, responseHeaders) {
          success(value);
        },
        function errorResponse (httpResponse) {

        });
        
        loaded = true;
      }
      
      return projectList;
    };
    
    that.load = load;
        
    reload = function () {
      loaded = false;
    };
    
    that.reload = reload;
    
    return that;
  }]);