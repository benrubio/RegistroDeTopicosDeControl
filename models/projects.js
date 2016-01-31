/*global require, module, console */

var model = require('../models/projects.js');

var express = require('express');
var router = express.Router();

var GitkitClient = require('gitkitclient');

var fs = require('fs');
var gitkitClient = new GitkitClient(JSON.parse(fs.readFileSync('./gitkit-server-config.json')));

/* GET projects */
router.get('/', function (req, res, next) {
  gitkitClient.verifyGitkitToken(req.headers.gtoken, function (err, resp) {
    if (err) {
      console.log('error');
      res.set({'Access-Control-Allow-Origin' : '*', 'Expires' : '-1'}).send('Bad GToken');
    } else {
      
      var projects = model.getProjects(resp);
      console.log(resp);
      res.set({'Expires' : '-1'}).send(projects.display_name);
    }
  });
});

module.exports = router;