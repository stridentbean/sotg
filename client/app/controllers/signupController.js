angular.module('signupCtrl', [])
.controller('signupController', function(Auth, $location, $window) {
  var vm = this;
  vm.user = {};
  vm.signUpUser = function(){
    if(vm.user.password !== vm.user.confirmPassword) {
      if(vm.user.confirmPassword) {
        vm.error = "Your passwords do not match.";
      } else {
        vm.error = "You must confirm your password in order to sign up.";
      }
    } else {
      Auth.signup(vm.user)
      .then(function(){
        $location.path('/profile');
      })
      .catch(function(err){
        vm.error = err.data.error;
      });
    }
  };
});
