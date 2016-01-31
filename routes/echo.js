var express = require('express');
var router = express.Router();

var GitkitClient = require('gitkitclient');

var fs = require('fs');
var gitkitClient = new GitkitClient(JSON.parse(fs.readFileSync('./gitkit-server-config.json')));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.set({'Access-Control-Allow-Origin' : '*', 'Expires' : '-1'}).send(req.gtoken);
});

module.exports = router;
