'use strict';
/*global describe, it, expect, beforeEach, spyOn, require, jasmine, runs, waitsFor */

var fs = require('fs');

describe('Google Identity Auth Component succesful authN', function () {
  var auth,
    request,
    response,
    nextSpy,
    nextHasBeenCalled;
  
  beforeEach(function () {
    nextHasBeenCalled = false;
    nextSpy = jasmine.createSpy('next');
    nextSpy.andCallFake(function () {
      nextHasBeenCalled = true;
    });
    
    request = {
      headers: {
        gtoken: fs.readFileSync('./test/data/sampleGtokenHeader.txt', 'utf8')
      }
    };
    response = {};
    
    auth = require('../../../../models/auth.js');

    runs(function () {
      auth(request, response, nextSpy);
    });

    waitsFor(function () {
      return nextHasBeenCalled;
    }, 'Next function should have been called', 1000);
    
    runs(function () {});
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
