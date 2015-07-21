angular.module('logoutCtrl', [])
.controller('logoutController', function(Auth, $location, $window) {
  Auth.logout();
});
