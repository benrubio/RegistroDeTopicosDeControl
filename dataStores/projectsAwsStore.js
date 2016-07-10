'use strict';
/*global module*/

var AWS = require('aws-sdk');

var projectsStore = function () {
  var getProjects, createProject,
    that = { };
  
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

if (process.argv[1].indexOf('projectsAwsStore.js') > -1) {
  
  AWS.config.loadFromPath('./aws.config.json');
  
  var dynamoDB = new AWS.DynamoDB();
  
  dynamoDB.getItem({
    Key: {
      projectId: { S: 'seedProject' }
    },
    TableName: 'ControlProjects'    
  }, function (err, data) {
    if (err) console.log(JSON.stringify(err));
    else console.log(JSON.stringify(data));
  })
}