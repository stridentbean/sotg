angular.module('sotgFactory', [])
.factory('Auth', function($http, $location, $window){
  var authFactory = {};
  authFactory.signup = function(user){
    return $http({
      method: 'POST',
      url: '/signup',
      data: user
    })
    .then(function(res){
      console.log('worked');
    });
  };
  authFactory.login = function(user){
    return $http({
      method: 'POST',
      url: '/signin',
      data: user
    })
    .then(function(res){
      console.log('worked');
    });    
  };
  return authFactory;
});
