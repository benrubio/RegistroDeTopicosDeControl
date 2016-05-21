'use strict';
/*global module*/

var projectsStore = function () {
  var getProjects, createProject,
    that = { }, projects = { };
  
  getProjects = function (userId) {
    return {resultCode: 'OK', result: projects[userId]};
  };
  that.getProjects = getProjects;
  
  createProject = function (userId, project) {
    if (typeof projects[userId] === 'undefined') {
      projects[userId] = [];
    }
    
    project.id = projects[userId].length;
    projects[userId].push(project);
    
    return {resultCode: 'OK', result: project};
  };
  that.createProject = createProject;
  
  return that;
};

module.exports = projectsStore();