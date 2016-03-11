'use strict';
/*global require, describe, beforeEach, it, expect, jasmine, spyOn*/

var proxyquire = require('proxyquire');

describe('projects get route', function () {
  var routes,
    model;
  beforeEach(function () {
    model = {};
    routes = proxyquire('../../../../routes/projectsRoutes.js', {'../models/projects.js': model});
  });
  
  it('should return 404 Not found when user does not exist', function () {
    var response = {
      status: function (statusCode) {
        expect(statusCode).toEqual(404);
        return this;
      },
      end: jasmine.createSpy('end')
    };
    
    spyOn(response, 'status').andCallThrough();
    
    model.getProjects = function (identity) {
      return { resultCode: 'NotFound' };
    };
    
    routes['/'].get({}, response);
    expect(response.status).toHaveBeenCalled();
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
    
    model.getProjects = function (identity) {
      return { resultCode: 'OK', result: projects};
    };
    
    routes['/'].get({}, response);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.set).toHaveBeenCalledWith({ 'Expires': '-1' });
    expect(response.json).toHaveBeenCalledWith(projects);
  });
  
  it('should return 500 if anything unexpected happens', function () {
    var response = {
      status: function (statusCode) {
        expect(statusCode).toEqual(500);
        return this;
      },
      end: jasmine.createSpy('end')
    },
      projects = {};
    
    spyOn(response, 'status').andCallThrough();
    
    model.getProjects = function (identity) {
      return { resultCode: 'Unexpected', result: projects};
    };
    
    routes['/'].get({}, response);
    expect(response.status).toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
  });
});