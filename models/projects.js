'use strict';
/*global require, module, console */

var projectsStore = require('../dataStores/projectsStore.js');

var getProjects = function (userId, continueWith) {
  var result;
  
  projectsStore.getProjects(userId, function (projectsFetch) {
    if (projectsFetch.resultCode === 'NotFound') {
      result = { resultCode : 'NotFound' };
    } else if (projectsFetch.resultCode === 'OK') {
      result = { resultCode : 'OK', result : projectsFetch.result };
    } else {
      result = { resultCode : 'Unknown' };
    }

    continueWith(result);
  });
};

var createProject = function (userId, project, continueWith) {
  projectsStore.createProject(userId, project, function (projectCreate) {
    continueWith(projectCreate);
  });
}

module.exports = {getProjects: getProjects, createProject: createProject};