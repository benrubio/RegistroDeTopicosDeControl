'use strict';
/*global require, describe, beforeEach, it, expect, jasmine */

var proxyquire = require('proxyquire');

describe('get projects', function () {
  var model,
    projectsStore;
  
  beforeEach(function () {
    projectsStore = {};
    model = proxyquire('../../../../models/projects.js', {'../dataStores/projectsStore.js': projectsStore});
  });
  
  it('should return NotFound when user does not exist', function () {
    var projects;
    projectsStore.getProjects = function (userId, continueWith) {
      continueWith({resultCode: 'NotFound'});
    };
    
    model.getProjects({userId: '12345'}, function (result) {
      projects = result;
    });
    
    expect(projects.resultCode).toEqual('NotFound');
  });
  
  it('should return project list from dataStore', function () {
    var userProjects = [{name: 'TestProject'}],
      projects;
    
    projectsStore.getProjects = function (userId, continueWith) {
      continueWith({resultCode: 'OK', result: userProjects});
    };
    
    model.getProjects({userId: '12345'}, function (result) {
      projects = result;
    });
    
    expect(projects.resultCode).toEqual('OK');
    expect(projects.result).toBe(userProjects);
  });
  
  it('should return unknown when dataStore behavior is unexpected', function () {
    var projects;
    
    projectsStore.getProjects = function (userId, continueWith) {
      continueWith({resultCode: 'SomeOtherResultCode'});
    };
    
    model.getProjects({userId: '12345'}, function (result) {
      projects = result;
    });
    
    expect(projects.resultCode).toEqual('Unknown');
  });
});

describe('create project', function () {
  var model,
    projectsStore;
  
  beforeEach(function () {
    projectsStore = {};
    model = proxyquire('../../../../models/projects.js', {'../dataStores/projectsStore.js': projectsStore});
  });
  
  it('should create a project using data store', function () {
    var project = {},
      userId = {},
      createResult;
    
    projectsStore.createProject = jasmine.createSpy('createProject');
    projectsStore.createProject.andCallFake(function (u, p, cW) {
      p.id = 'id';
      cW({resultCode: 'OK', result: p});
    });
    
    model.createProject(userId, project, function (result) {
      createResult = result;
    });
    
    expect(projectsStore.createProject).toHaveBeenCalled();
    expect(createResult).toBeDefined();
    expect(createResult.resultCode).toEqual('OK');
    expect(createResult.result).toBeDefined();
    expect(createResult.result).toEqual(project);
  });
});