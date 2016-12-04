'use strict';
/*global require, module, console */

var express = require('express');
var router = express.Router();
var routes = require('./projectsRoutes.js');

router.get('/:projectId', routes['/:projectId'].get);
router.get('/', routes['/'].get);
router.post('/', routes['/'].post);

module.exports = router;