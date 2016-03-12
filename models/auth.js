'use strict';
/*global module, require */

var authModule = function () {
  var gitkitClient, authN, setGitkitClient,
    that = { };
  
  authN = function (request, response, next) {
    var gtoken = request.headers.gtoken;
    if (gtoken === undefined
         || gtoken.trim() === '') {
      response.status(401).end();
    } else {
      gitkitClient.verifyGitkitToken(gtoken, function (err, resp) {
        request.identity = { userId: resp.user_id };
        request.gtoken = resp;
        next();
      });
    }
  };
  that.authN = authN;
  
  setGitkitClient = function (client) {
    gitkitClient = client;
  };
  that.setGitkitClient = setGitkitClient;
  
  return that;
};

module.exports = authModule();