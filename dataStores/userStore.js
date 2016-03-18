'use strict';
/*global module*/

var userStore = function () {
  var getUser,
    that = { }, users = { };
  
  getUser = function (identity) {
    var identityKey = identity.provider + '_' + identity.id;
    
    if (typeof users[identityKey] === 'undefined') {
      return { resultCode: 'NotFound', result: { id: 'empty', externalIdentity: identity }};
    }
    
    return {resultCode: 'OK', result: users[identityKey]};
  };
  that.getUser = getUser;
  
  return that;
};

module.exports = userStore();