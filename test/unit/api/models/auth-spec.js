'use strict';
/*global describe, it, expect, beforeEach, spyOn, require, jasmine, runs, waitsFor */

describe('Google Identity Auth Component succesful authN', function () {
  var auth,
    request,
    response,
    nextSpy,
    nextHasBeenCalled,
    gitkitClient;
  
  beforeEach(function () {
    nextHasBeenCalled = false;
    
    nextSpy = jasmine.createSpy('next');
    nextSpy.andCallFake(function () {
      nextHasBeenCalled = true;
    });
    
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
