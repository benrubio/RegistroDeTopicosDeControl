'use strict';
/*global require, module*/

var model = require('../models/projects.js');

var projectsRoutes = {
  '/': {
    get: function (request, response) {
      var projects = model.getProjects(request.identity);

      if (projects.resultCode === 'NotFound') {
        response.status(404).end();
        return;
      } else if (projects.resultCode === 'OK') {
        response.status(200).json(projects.result);
        return;
      }
      
      response.status(500).end();
    },
    post: function (request, response) {
      var projects = model.createProject(request.identity, request.body);
      response.status(200).end();
    }
  }
};

module.exports = projectsRoutes;