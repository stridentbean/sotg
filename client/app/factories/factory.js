angular.module('sotgFactory', [])
.factory('Auth', function($http, $location, $window){
  var authFactory = {};
  authFactory.signup = function(user){
    return $http({
      method: 'POST',
      url: 'users/signup',
      data: user
    })
    .then(function(res){
      console.log(res);
    });
  };
  authFactory.login = function(user){
    return $http({
      method: 'POST',
      url: 'users/signin',
      data: user
    })
    .then(function(res){
      console.log(res);
    });    
  };
  return authFactory;
});
