'use strict';
/*global describe, it, expect, beforeEach, spyOn, jasmine, runs, waitsFor, require */

var proxyquire = require('proxyquire');

describe('Succesful authN', function () {
  var auth,
    request,
    response,
    nextSpy,
    firebaseAuth,
    succesfulExternalAuthNTest;
  
  beforeEach(function () {
    nextSpy = jasmine.createSpy('next');
    
    firebaseAuth = {
      verifyIdToken: function (token) {
        return new Promise(function (resolve, reject) {
          resolve({ uid: '10309694082854684614' });
        });
      }
    };
    
    request = {
      headers: {
        gtoken: 'fakeGtokenHeaderValue'
      }
    };
    response = {};
    
    auth = require('../../../../models/auth.js');
    auth.setFirebaseAuth(firebaseAuth);
  });
  
  describe('basic', function () {
    beforeEach(function () {
      var authEndDetection;
      
      authEndDetection = function () {
        return nextSpy.calls.length === 1;
      };
      
      succesfulExternalAuthNTest(authEndDetection);
    });
    
    it('should call next when auth succeeds', function () {
      expect(nextSpy).toHaveBeenCalled();
      expect(nextSpy.calls.length).toEqual(1);
    });

    it('should define request authNResult', function () {
      expect(request.authNResult).toBeDefined();
    });

    it('should be authenticated', function () {
      expect(request.authNResult.isAuthenticated()).toBeTruthy();
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

describe('Failed authN', function () {
  var auth,
    request,
    response,
    nextSpy,
    firebaseAuth,
    headerManipulationTest,
    authEndDetection;
  
  beforeEach(function () {
    nextSpy = jasmine.createSpy('next');
    request = { headers: { } };
    
    firebaseAuth = {
      verifyIdToken: function (token) {
        return new Promise(function (resolve, reject) {
          reject({ reason: 'failed' });
        });
      }
    };
             
    auth = require('../../../../models/auth.js');
    auth.setFirebaseAuth(firebaseAuth);
    
    authEndDetection = function () {
      return nextSpy.calls.length === 1;
    };
  });
  
  it('should unauthorize when gToken header is not present', function () {
    var validation;
    
    validation = function () {
      expect(request.authNResult).toBeDefined();
      expect(request.authNResult.isAuthenticated()).toBeFalsy();
    };
    
    headerManipulationTest(authEndDetection, validation);
  });
  
  it('should unauthorize when gToken is empty', function () {
    var validation;
    
    request.headers.gtoken = '';
    
    validation = function () {
      expect(request.authNResult).toBeDefined();
      expect(request.authNResult.isAuthenticated()).toBeFalsy();
    };
    
    headerManipulationTest(authEndDetection, validation);
  });
  
  it('should unauthorize when gToken is whitespace', function () {
    var validation;
    
    request.headers.gtoken = ' ';
    
    validation = function () {
      expect(request.authNResult).toBeDefined();
      expect(request.authNResult.isAuthenticated()).toBeFalsy();
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
