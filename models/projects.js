'use strict';
/*global require, module, console */

var projectsStore = require('../dataStores/projectsStore.js');

var getProjects = function (userId) {
  
  var projectsFetch = projectsStore.getProjects(userId);
  
  if (projectsFetch.resultCode === 'NotFound') {
    return { resultCode : 'NotFound' };
  } else if (projectsFetch.resultCode === 'OK') {
    return { resultCode : 'OK', result : projectsFetch.result };
  }
  
  return { resultCode : 'Unknown' };
};

module.exports = {getProjects: getProjects};