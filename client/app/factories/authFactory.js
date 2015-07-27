/**
 * factory to interact with backend server for authentication
 * @class
 */
angular.module('sotgFactory', [])
.factory('Auth', function($http, $location, $window){
  var authFactory = {};
  /**
 * method to sign up users
 * @function
 */
  authFactory.signup = function(user){
    return $http({
      method: 'POST',
      url: 'users/signup',
      data: user
    })
    .success(function(data, status, headers, config){
      console.log(status);
    })
    .error(function(data, status, headers, config){
      console.log(status);
      console.log(data);
    });
  };
  /**
   * method to log in users
   * @function
   */

  authFactory.login = function(user){
    return $http({
      method: 'POST',
      url: 'users/signin',
      data: user
    })
    .success(function(data, status, headers, config) {
      console.log(status);
    })
    .error(function(data, status, headers, config) {
      console.log(status);
      console.log(data);
    });
  };

  authFactory.profile = function(){
    return $http({
      method: 'GET', 
      url: 'users/profile'
    })
    .success(function(data, status, headers, config) {
      console.log("Data inside profile, ", data);
      authFactory.keywords(data);
    })
    .error(function(data, status, headers, config) {
    });
  };

  authFactory.keywords = function(user){
    console.log("User inside keywords", user);
    // var apiKey = user.apiKey;
    return $http({
      method: 'GET', 
      url: 'users/keywords?apiKey=' + user.apiKey
    })
    .success(function(data, status, headers, config) {
    })
    .error(function(data, status, headers, config) {
    });
  };

  authFactory.logout = function() {
    return $http({
      method: 'GET',
      url: 'users/logout'
    })
    .success(function() {
      $location.path('/');
    })
    .error(function(err){
      console.log(err);
    });
  };

  authFactory.updatePassword = function(username, password) {
    console.log("authFactory.updatePassword");
    return $http({
      method: 'POST',
      url: 'users/password',
      data: JSON.stringify({
        user: username,
        password: password
      })
    })
    .success(function() {
      console.log("Updated password.");
    })
    .error(function(err) {
      console.log("Couldn't update password. Error: ", err);
    });
  };

  authFactory.sendPasswordResetEmail = function (username) {
    return $http({
      method: 'POST',
      url: 'users/password/forgot',
      data: {
        username: username
      }
    })
    .success(function() {
      console.log("Resetting password for ", username);
    })
    .error(function(err) {
      console.log("Error resetting password for ", username);
    });
  };

  authFactory.resetPassword = function(username) {
    return $http({
      method: 'POST',
      url: 'users/password/reset',
      data: {
        username: username
      }
    })
    .success(function() {
      console.log("Resetting password for ", username);
    })
    .error(function(err) {
      console.log("Error resetting password for ", username);
    });
  };

  return authFactory;
});
