'use strict';
/*global module, require */

var GitkitClient = require('gitkitclient');

var fs = require('fs');
var gitkitClient = new GitkitClient(JSON.parse(fs.readFileSync('./gitkit-server-config.json')));

var getIdentity = function (request, response, next) {
  
  if (request.headers.gtoken === undefined) {
    next();
  } else {
    gitkitClient.verifyGitkitToken(request.headers.gtoken, function (err, resp) {
      request.identity = { userId: resp.user_id };
      request.gtoken = resp;
      next();
    });
  }
};

module.exports = getIdentity;