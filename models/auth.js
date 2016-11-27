'use strict';
/*global module, require */

var authModule = function () {
  var firebaseAuth, authN, setFirebaseAuth,
    that = { };
  
  authN = function (request, response, next) {
    var gtoken = request.headers.gtoken;
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
          next();
        });
    }
  };
  that.authN = authN;
  
  setFirebaseAuth = function (auth) {
    firebaseAuth = auth;
  };
  that.setFirebaseAuth = setFirebaseAuth;
  
  return that;
};

module.exports = authModule();