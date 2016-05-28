'use strict';
/*global require, module, console */

var express = require('express');
var router = express.Router();
var routes = require('./projectsRoutes.js');

// TODO: We should move this method into the projectsRoutes file
router.param('projectId', function (req, res, next, projectId) {
  req.projectId = projectId;
  console.log('Project Id: ' + projectId);
  next();
});

router.get('/:projectId', routes['/:projectId'].get);
router.get('/', routes['/'].get);
router.post('/', routes['/'].post);

module.exports = router;