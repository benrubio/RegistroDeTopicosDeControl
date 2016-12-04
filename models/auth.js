'use strict';
/*global module, require */

var authModule = function () {
  var firebaseAuth, authN, setFirebaseAuth, 
      debugLogging, setDebugLogging, debugLog,
      that = { };
  
  authN = function (request, response, next) {
    var gtoken = request.headers.gtoken;
    debugLog('Gtoken: ' + gtoken);
    
    if (gtoken === undefined
         || gtoken.trim() === '') {
      var authNResult = {
        getIdentity: function () {
          return null;
        },
        isAuthenticated: function () {
          return false;
        }
      };
      request.authNResult = authNResult;
      next();
    } else {
      firebaseAuth.verifyIdToken(gtoken)
        .then(function (decodedToken) {
          debugLog('Token verified.' + JSON.stringify(decodedToken));
          var authNResult = {
            getIdentity: function () {
              return { userId: decodedToken.uid };
            },
            isAuthenticated: function () {
              return true;
            }
          };
          request.authNResult = authNResult;
          next();
        })
        .catch(function (error) {
          debugLog('Token verification failed.' + JSON.stringify(error) + error);
          var authNResult = {
            isAuthenticated: function () {
              return false;
            }
          };
          request.authNResult = authNResult;
          next();
        });
    }
  };
  that.authN = authN;
  
  setFirebaseAuth = function (auth) {
    firebaseAuth = auth;
  };
  that.setFirebaseAuth = setFirebaseAuth;
  
  setDebugLogging = function (logDebug) {
    debugLogging = logDebug;
  };
  that.setDebugLogging = setDebugLogging;
  
  debugLog = function (details) {
    if (debugLogging) {
      console.log(details);
    }
  }
  
  return that;
};

module.exports = authModule();