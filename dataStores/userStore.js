'use strict';
/*global module*/

var userStore = function () {
  var getUser,
    that = { }, users = { };
  
  getUser = function (identity) {
    var identityKey = identity.provider + '_' + identity.id;
    return {resultCode: 'OK', result: users[identityKey]};
  };
  that.getUser = getUser;
  
  return that;
};

module.exports = userStore();