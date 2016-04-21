var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('echo: ' + req.identity.id);
  res.set({'Access-Control-Allow-Origin' : '*', 'Expires' : '-1'}).send(req.identity.id);
});

module.exports = router;
