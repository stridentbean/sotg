angular.module('resetPasswordCtrl', [])
.controller('resetPasswordController', function( Auth, $location) {
  var vm = this;
  console.log($location.search().token);
  vm.token = $location.search().token;
  vm.resetPassword = function() {
    Auth.resetPassword(vm.token)
    .then(function(res) {
      console.log("Reset password with token: " + vm.token);
      console.log(res);
    });
  };
});
