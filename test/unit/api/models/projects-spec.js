'use strict';
/*global describe, it, expect, beforeEach, spyOn, require, jasmine, runs, waitsFor */

describe('Project look-up', function () {
  describe('User not found', function () {
    var model;
    
    beforeEach(function () {
      model = require('../../../../models/projects.js');
    });
    
    it('should return not found when the user does not exist', function () {
      var projects = model.getProjects();
    });
  });
});