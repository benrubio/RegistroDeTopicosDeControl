'use strict';
/*global describe, it, expect, beforeEach, spyOn, require, jasmine, runs, waitsFor */

describe('Auth Component succesful authN', function () {
  var auth,
    request,
    response,
    nextSpy,
    gitkitClient;
  
  beforeEach(function () {
    nextSpy = jasmine.createSpy('next');
    
    gitkitClient = {
      verifyGitkitToken: function (token, callback) {
        // TODO: properly define what a null error looks like
        callback(null, { user_id: '10309694082854684614' });
      }
    };
    spyOn(gitkitClient, 'verifyGitkitToken').andCallThrough();
    
    request = {
      headers: {
        gtoken: 'fakeGtokenHeaderValue'
      }
    };
    response = {};
    
    auth = require('../../../../models/auth.js');
    auth.setGitkitClient(gitkitClient);
    
    runs(function () {
      auth.authN(request, response, nextSpy);
    });
    
    waitsFor(function () {
      return nextSpy.calls.length === 1;
    }, 'Next function should have been called', 1000);
    
  });
  
  it('should call next when auth succeeds', function () {
    expect(nextSpy).toHaveBeenCalled();
    expect(nextSpy.calls.length).toEqual(1);
  });
  
  it('should define request identity', function () {
    expect(request.identity).toBeDefined();
  });
  
  it('should set identity with the user_id field from the gtoken', function () {
    expect(request.identity).toBeDefined();
    expect(request.identity.userId).toEqual('10309694082854684614');
  });
  
  it('should set gtoken to the raw gtoken', function () {
    expect(request.gtoken).toBeDefined();
  });
});

describe('Auth component failures for authN', function () {
  var auth,
    request,
    response,
    nextSpy,
    gitkitClient,
    headerManipulationTest;
  
  beforeEach(function () {
    nextSpy = jasmine.createSpy('next');
    request = { headers: { } };
    response = { };
    
    gitkitClient = {
      verifyGitkitToken: jasmine.createSpy('verifyGitkitToken')
    };
             
    auth = require('../../../../models/auth.js');
    auth.setGitkitClient(gitkitClient);
  });
  
  it('should respond Unauthorized when gToken header is not present', function () {
    var authEndDetection, validation;
    
    response.status = jasmine.createSpy('status');
    response.status.andReturn(response);
    response.end = jasmine.createSpy('end');
    
    authEndDetection = function () {
      return response.end.calls.length === 1;
    };
    validation = function () {
      expect(response.status).toHaveBeenCalledWith(401);
      expect(nextSpy.calls.length).toEqual(0);
    };
    
    headerManipulationTest(authEndDetection, validation);
  });
  
  it('should respond Unauthorized when gToken is empty', function () {
    var authEndDetection, validation;
    
    response.status = jasmine.createSpy('status');
    response.status.andReturn(response);
    response.end = jasmine.createSpy('end');
    
    request.headers.gtoken = '';
    
    authEndDetection = function () {
      return response.end.calls.length === 1;
    };
    validation = function () {
      expect(response.status).toHaveBeenCalledWith(401);
      expect(nextSpy.calls.length).toEqual(0);
    };
    
    headerManipulationTest(authEndDetection, validation);
  });
  
  it('should respond Unauthorized when gToken is whitespace', function () {
    var authEndDetection, validation;
    
    response.status = jasmine.createSpy('status');
    response.status.andReturn(response);
    response.end = jasmine.createSpy('end');
    
    request.headers.gtoken = ' ';
    
    authEndDetection = function () {
      return response.end.calls.length === 1;
    };
    validation = function () {
      expect(response.status).toHaveBeenCalledWith(401);
      expect(nextSpy.calls.length).toEqual(0);
    };
    
    headerManipulationTest(authEndDetection, validation);
  });
  
  headerManipulationTest = function (authEndDetection, validation) {
    runs(function () {
      auth.authN(request, response, nextSpy);
    });
    
    waitsFor(function () {
      return authEndDetection();
    }, 'Auth should have ended', 100);

    runs(function () {
      validation();
    });
  };
});
