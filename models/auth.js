'use strict';
/*global module, require */

var authModule = function () {
  var gitkitClient, authN, setGitkitClient,
    that = { };
  
  authN = function (request, response, next) {
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
  that.authN = authN;
  
  setGitkitClient = function (client) {
    gitkitClient = client;
  };
  that.setGitkitClient = setGitkitClient;
  
  return that;
};

module.exports = authModule();