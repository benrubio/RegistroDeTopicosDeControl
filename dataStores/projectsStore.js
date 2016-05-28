'use strict';
/*global module*/

var projectsStore = function () {
  var getProjects, createProject,
    that = { }, projects = { };
  
  getProjects = function (userId, continueWith) {
    continueWith({resultCode: 'OK', result: projects[userId]});
  };
  that.getProjects = getProjects;
  
  createProject = function (userId, project, continueWith) {
    if (typeof projects[userId] === 'undefined') {
      projects[userId] = [];
    }
    
    project.id = projects[userId].length;
    projects[userId].push(project);
    
    continueWith({resultCode: 'OK', result: project});
  };
  that.createProject = createProject;
  
  return that;
};

module.exports = projectsStore();