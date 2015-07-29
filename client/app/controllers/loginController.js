angular.module('loginCtrl', [])
.controller('loginController', function(Auth, $location, $window) {
  var vm = this;
  vm.user = {};
  vm.logInUser = function(){
    Auth.login(vm.user)
    .then(function(){
      $location.path('/profile');
    })
    .catch(function(err){
      vm.error = err.data.error;
    });
  };
  vm.requestReset = function() {
    if (!vm.user.username) {
      vm.forgotPasswordResponse = {error: "Please enter your email address to recover your password."};
      return;
    }
    Auth.requestReset(vm.user.username)
    .then(function(res) {
      // console.log("loginController.requestReset -> ", res);
      vm.forgotPasswordResponse = res.data;
    })
    .catch(function(res) {
      // console.log("loginController.requestRest catch -> ", res);
      vm.forgotPasswordResponse = res.data;
    });
  };
});
