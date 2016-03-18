'use strict';
/*global module, require */

var userStore = require('../dataStores/userStore.js');

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
        var identity = { id: resp.user_id, provider: resp.provider_id },
          userResult;
        
        userResult = userStore.getUser(identity);
        
        if (userResult.resultCode === 'OK'
             || userResult.resultCode === 'NotFound') {
          request.identity = userResult.result;
          request.gtoken = resp;
          next();
        } else {
          response.status(500).end();
        }
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