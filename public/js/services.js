'use strict';

/* Services */

var topicosServices = angular.module('topicosServices', ['ngResource', 'ngCookies']);

topicosServices.factory('projects', ['$resource', '$cookies',
  function projectsFactory($resource, $cookies){
    var resource, gTokenGetter, loaded, load, reload, loadProject, create, safeMethodCall,
        projectList = [], that = { }, lookup = { };

    loaded = false;
    gTokenGetter = function() {
      return $cookies.get('gtoken');
    }
    
    resource = $resource('/projects/:projectId', { projectId: '' }, {
      query: {
        method: 'GET',
		headers: { 'gtoken': gTokenGetter },
        isArray: true
	  },
      get: {
        method: 'GET',
        headers: { 'gtoken': gTokenGetter },
        isArray: false
      },
      create: {
        method: 'POST',
        headers: { 'gtoken': gTokenGetter },
        isArray: false
      }
    });
    
    load = function (success) {
      if (!loaded) {
        projectList = resource.query(function successResponse (value, responseHeaders) {
          
          for (var i = 0; i < value.length; i++) {
            lookup[value[i].id] = { project: value[i] };
          }
          
          success(value);
        },
        function errorResponse (httpResponse) {

        });
        
        loaded = true;
      }
      
      return projectList;
    };
    
    that.load = load;
    
    loadProject = function (id, success) {
      var project;
      
      if (lookup[id] != undefined) {
        project = lookup[id].project;
        safeMethodCall(success, [ lookup[id] ]);
      } else {
        project = resource.get({ projectId: id }, function successResponse (value, responseHeaders) {
          safeMethodCall(success, [ value ]);
        });
        lookup[id] = { project: project };
      }

      return project;
    };
    
    that.loadProject = loadProject;
        
    reload = function () {
      loaded = false;
      
      lookup = { };
    };
    
    that.reload = reload;
    
    create = function (project, success) {
      return resource.create(null, project, function successResponse (value, responseHeaders) {
        projectList.push(value);
        lookup[value.id] = { project: value };
        success(value);
      });
    };
    
    that.create = create;
    
    safeMethodCall = function (method, args) {
      if (method != undefined) {
        method.apply(null, args);
      }
    }
    
    return that;
  }]);