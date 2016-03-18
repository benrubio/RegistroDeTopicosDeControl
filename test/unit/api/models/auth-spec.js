'use strict';
/*global describe, it, expect, beforeEach, spyOn, jasmine, runs, waitsFor, require */

var proxyquire = require('proxyquire');

describe('Auth Component succesful external authN', function () {
  var auth,
    request,
    response,
    nextSpy,
    gitkitClient,
    userStore,
    succesfulExternalAuthNTest;
  
  beforeEach(function () {
    nextSpy = jasmine.createSpy('next');
    
    gitkitClient = {
      verifyGitkitToken: function (token, callback) {
        // TODO: properly define what a null error looks like
        callback(null, { user_id: '10309694082854684614', provider_id: 'google.com' });
      }
    };
    spyOn(gitkitClient, 'verifyGitkitToken').andCallThrough();
    
    request = {
      headers: {
        gtoken: 'fakeGtokenHeaderValue'
      }
    };
    response = {};
    
    userStore = { getUser: jasmine.createSpy('getUser') };
        
    auth = proxyquire('../../../../models/auth.js', {'../dataStores/userStore.js': userStore});
    auth.setGitkitClient(gitkitClient);
  });
  
  describe('Authenticated user exists', function () {
    beforeEach(function () {
      var externalIdentity = {id: '10309694082854684614', provider: 'google.com'},
        authEndDetection;
      
      userStore.getUser.andReturn({ resultCode: 'OK', result: { id: 'userId', externalIdentity: externalIdentity } });
      
      authEndDetection = function () {
        return nextSpy.calls.length === 1;
      };
      
      succesfulExternalAuthNTest(authEndDetection);
    });
    
    it('should call next when auth succeeds', function () {
      expect(nextSpy).toHaveBeenCalled();
      expect(nextSpy.calls.length).toEqual(1);
    });

    it('should fetch user from userStore', function () {
      expect(userStore.getUser).toHaveBeenCalled();
    });

    it('should define request identity', function () {
      expect(request.identity).toBeDefined();
      expect(request.identity.id).toEqual('userId');
    });

    it('should set external identity from the gtoken', function () {
      expect(request.identity.externalIdentity).toBeDefined();
      expect(request.identity.externalIdentity.id).toEqual('10309694082854684614');
      expect(request.identity.externalIdentity.provider).toEqual('google.com');
    });

    it('should set gtoken to the raw gtoken', function () {
      expect(request.gtoken).toBeDefined();
    });
  });
  
  describe('Error when fetching user', function () {
    beforeEach(function () {
      var authEndDetection;
      
      userStore.getUser.andReturn({ resultCode: 'Error' });
      
      response.status = jasmine.createSpy('status');
      response.status.andReturn(response);
      response.end = jasmine.createSpy('end');
      
      authEndDetection = function () {
        return response.end.calls.length === 1;
      };
      
      succesfulExternalAuthNTest(authEndDetection);
    });
    
    it('should respond with Error', function () {
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.end).toHaveBeenCalled();
    });
  });
  
  describe('User not found', function () {
    beforeEach(function () {
      var authEndDetection,
        externalIdentity = {id: '10309694082854684614', provider: 'google.com'};
      
      userStore.getUser.andReturn({ resultCode: 'NotFound', result: { id: 'empty', externalIdentity: externalIdentity } });
      
      authEndDetection = function () {
        return nextSpy.calls.length === 1;
      };
      
      succesfulExternalAuthNTest(authEndDetection);
    });
    
    it('should call next to continue the request', function () {
      expect(nextSpy).toHaveBeenCalled();
      expect(nextSpy.calls.length).toEqual(1);
    });
    
    it('should define request identity with empty identity', function () {
      expect(request.identity).toBeDefined();
      expect(request.identity.id).toEqual('empty');
    });
    
    it('should set external identity', function () {
      expect(request.identity.externalIdentity).toBeDefined();
      expect(request.identity.externalIdentity.id).toEqual('10309694082854684614');
      expect(request.identity.externalIdentity.provider).toEqual('google.com');
    });
  });
  
  succesfulExternalAuthNTest = function (authEndDetection) {
    runs(function () {
      auth.authN(request, response, nextSpy);
    });
    
    waitsFor(function () {
      return authEndDetection();
    }, 'Auth should have ended', 1000);
  };
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
