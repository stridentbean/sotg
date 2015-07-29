angular.module('resetPasswordCtrl', [])
.controller('resetPasswordController', function( Auth, $location) {
  var vm = this;
  vm.user = $location.search().user;
  vm.resetPassword = function() {
    Auth.updatePassword(vm.user, vm.newPassword)
    .then(function(res) {
      // console.log("Reset password with token: " + vm.user);
    });
  };
});
