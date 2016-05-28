'use strict';
/*global require, module*/

var model = require('../models/projects.js');

var projectsRoutes = {
  '/': {
    get: function (request, response) {
      model.getProjects(request.identity, function(projects) {
        if (projects.resultCode === 'NotFound') {
          response.status(404).end();
          return;
        } else if (projects.resultCode === 'OK') {
          response.status(200).set({ 'Expires': '-1' }).json(projects.result);
          return;
        }

        response.status(500).end();
      });
    },
    post: function (request, response) {
      model.createProject(request.identity, request.body, function(project) {
        if (project.resultCode === 'NotFound') {
          response.status(404).end();
          return;
        } else  if (project.resultCode === 'OK') {
          response.status(200).json(project.result);  
          return;
        }

        response.status(500).end();
      });
    }
  },
  '/:projectId': {
    get: function (request, response) {
      model.getProject(request.identity, request.projectId, function(project) {
        if (project.resultCode === 'NotFound') {
          response.status(404).end();
          return;
        } else if (project.resultCode === 'OK') {
          response.status(200).set({ 'Expires': '-1' }).json(project.result);
          return;
        }

        response.status(500).end();
      });
    }
  }
};

module.exports = projectsRoutes;