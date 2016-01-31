'use strict';
/*global require, module, console */

var express = require('express');
var router = express.Router();
var routes = require('./projectsRoutes.js');

/* GET projects */
router.get('/', routes['/'].get);

module.exports = router;