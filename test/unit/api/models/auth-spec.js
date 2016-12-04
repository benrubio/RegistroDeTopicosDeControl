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
    authEndDetection;
  
  beforeEach(function () {
    nextSpy = jasmine.createSpy('next');
             
    auth = require('../../../../models/auth.js');
    
    authEndDetection = function () {
      return nextSpy.calls.length === 1;
    };
  });
  
  describe('missing authentication', function () {
    var headerManipulationTest;
    
    beforeEach(function () { 
      request = { headers: { } };
    });
  
    it('should unauthorize when gToken header is not present', function () {
      headerManipulationTest(authEndDetection);
    });

    it('should unauthorize when gToken is empty', function () {
      request.headers.gtoken = '';

      headerManipulationTest(authEndDetection);
    });

    it('should unauthorize when gToken is whitespace', function () {
      request.headers.gtoken = ' ';

      headerManipulationTest(authEndDetection);
    });

    headerManipulationTest = function (authEndDetection, validation) {
      runs(function () {
        auth.authN(request, response, nextSpy);
      });

      waitsFor(function () {
        return authEndDetection();
      }, 'Auth should have ended', 100);

      runs(function () {
        expect(request.authNResult).toBeDefined();
        expect(request.authNResult.isAuthenticated()).toBeFalsy();
      });
    };
  });
  
  describe('firebase auth error', function () {
    var headerManipulationTest, firebaseAuth;
    
    beforeEach(function () { 
      
      firebaseAuth = {
        verifyIdToken: function (token) {
          return new Promise(function (resolve, reject) {
            reject({ reason: 'failed' });
          });
        }
      };
      
      auth.setFirebaseAuth(firebaseAuth);
      
      request = {
        headers: {
          gtoken: 'fakeGtokenHeaderValue'
        }
      };
      
      runs(function () {
        auth.authN(request, response, nextSpy);
      });

      waitsFor(function () {
        return authEndDetection();
      }, 'Auth should have ended', 1000);
    });
    
    it('should not be authenticated', function () {
      expect(request.authNResult).toBeDefined();
      expect(request.authNResult.isAuthenticated()).toBeFalsy();
    });
    
  });
});
