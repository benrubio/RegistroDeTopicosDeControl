'use strict';
/*global require, describe, beforeEach, it, expect */

var proxyquire = require('proxyquire');

describe('projects model', function () {
  var model,
    projectsStore;
  
  beforeEach(function () {
    projectsStore = {};
    model = proxyquire('../../../../models/projects.js', {'../dataStores/projectsStore.js': projectsStore});
  });
  
  it('should return NotFound when user does not exist', function () {
    projectsStore.getProjects = function (userId) {
      return {resultCode: 'NotFound'};
    };
    var projects = model.getProjects({userId: '12345'});
    
    expect(projects.resultCode).toEqual('NotFound');
  });
  
  it('should return project list from dataStore', function () {
    var userProjects = [{name: 'TestProject'}],
      projects;
    
    projectsStore.getProjects = function (userId) {
      return {resultCode: 'OK', result: userProjects};
    };
    
    projects = model.getProjects({userId: '12345'});
    
    expect(projects.resultCode).toEqual('OK');
    expect(projects.result).toBe(userProjects);
  });
  
  it('should return unknown when dataStore behavior is unexpected', function () {
    var projects;
    
    projectsStore.getProjects = function (userId) {
      return {resultCode: 'SomeOtherResultCode'};
    };
    
    projects = model.getProjects({userId: '12345'});
    
    expect(projects.resultCode).toEqual('Unknown');
  });
});