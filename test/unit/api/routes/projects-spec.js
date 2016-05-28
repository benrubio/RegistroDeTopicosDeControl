'use strict';
/*global require, describe, beforeEach, it, expect, jasmine, spyOn*/

var proxyquire = require('proxyquire');

describe('projects', function () {
  var routes,
    model;
  beforeEach(function () {
    model = {};
    routes = proxyquire('../../../../routes/projectsRoutes.js', {'../models/projects.js': model});
  });
  
  describe('get route', function () {
    it('should return 404 Not found when user does not exist', function () {
      var response = {
        status: jasmine.createSpy('status'),
        end: jasmine.createSpy('end')
      };

      response.status.andReturn(response);

      model.getProjects = function (identity, continueWith) {
        continueWith({ resultCode: 'NotFound' });
      };

      routes['/'].get({}, response);
      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.end).toHaveBeenCalled();
    });

    it('should return 200 OK with projects when user is found', function () {
      var response = {
          status: jasmine.createSpy('status'),
          set: jasmine.createSpy('set'),
          json: jasmine.createSpy('json')
        },
        projects = {};

      response.status.andReturn(response);
      response.set.andReturn(response);

      model.getProjects = function (identity, continueWith) {
        continueWith({ resultCode: 'OK', result: projects});
      };

      routes['/'].get({}, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.set).toHaveBeenCalledWith({ 'Expires': '-1' });
      expect(response.json).toHaveBeenCalledWith(projects);
    });

    it('should return 500 if anything unexpected happens', function () {
      var response = {
        status: jasmine.createSpy('status'),
        end: jasmine.createSpy('end')
      },
        projects = {};

      response.status.andReturn(response);
      
      model.getProjects = function (identity, continueWith) {
        continueWith({ resultCode: 'Unexpected', result: projects});
      };

      routes['/'].get({}, response);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.end).toHaveBeenCalled();
    });
  });
  
  describe('get-single route', function () {
    it('should return 404 Not found when the projects are not found', function () {
      var response = {
        status: jasmine.createSpy('status'),
        end: jasmine.createSpy('end')
      };

      response.status.andReturn(response);

      model.getProject = function (identity, projectId, continuewWith) {
        expect(projectId).toEqual('0');
        continuewWith({ resultCode: 'NotFound' });
      };

      routes['/:projectId'].get({ projectId: '0' }, response);
      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.end).toHaveBeenCalled();
    });

    it('should return 200 OK with project when projects is found', function () {
      var response = {
          status: jasmine.createSpy('status'),
          set: jasmine.createSpy('set'),
          json: jasmine.createSpy('json')
        },
        project = { id: '0' };

      response.status.andReturn(response);
      response.set.andReturn(response);

      model.getProject = function (identity, projectId, continueWith) {
        expect(projectId).toEqual('0');
        continueWith({ resultCode: 'OK', result: project });
      };

      routes['/:projectId'].get({ projectId: '0' }, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.set).toHaveBeenCalledWith({ 'Expires': '-1' });
      expect(response.json).toHaveBeenCalledWith(project);
    });
    
    it('should return 500 if anything unexpected happens', function () {
      var response = {
        status: jasmine.createSpy('status'),
        end: jasmine.createSpy('end')
      };

      response.status.andReturn(response);

      model.getProject = function (identity, projectId, continueWith) {
        expect(projectId).toEqual('0');
        continueWith({ resultCode: 'Unexpected' });
      };

      routes['/:projectId'].get({ projectId: '0' }, response);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.end).toHaveBeenCalled();
    });
  });
  
  describe('create route', function () {
    it('should return 404 Not found when user does not exist', function () {
      var response = {
          status: jasmine.createSpy('status'),
          end: jasmine.createSpy('end')
        },
        request = {
          body: { },
        };

      response.status.andReturn(response);

      model.createProject = function (identity, body, continueWith) {
        expect(body).toBe(request.body);
        continueWith({ resultCode: 'NotFound' });
      };

      routes['/'].post(request, response);
      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.end).toHaveBeenCalled();
    });
    
    it('should return 200 OK with created project', function () {
      var response = {
          status: jasmine.createSpy('status'),
          json: jasmine.createSpy('json')
        },
        projects = {},
        request = {
          body: {}
        };

      response.status.andReturn(response);

      model.createProject = function (identity, project, continueWith) {
        continueWith({ resultCode: 'OK', result: project});
      };

      routes['/'].post(request, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(request.body);      
    });
    
    it('should return 500 if anything unexpected happens', function () {
      var response = {
          status: jasmine.createSpy('status'),
          end: jasmine.createSpy('end')
        },
        request = {
          body: { },
        };

      response.status.andReturn(response);

      model.createProject = function (identity, body, continueWith) {
        expect(body).toBe(request.body);
        continueWith({ resultCode: 'Unexpected' });
      };

      routes['/'].post(request, response);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.end).toHaveBeenCalled();
    });
  });
});
