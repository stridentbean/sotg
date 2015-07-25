angular.module('signupCtrl', [])
.controller('signupController', function(Auth, $location, $window, $scope) {
  var vm = this;
  vm.user = {};
  vm.signUpUser = function(){
    $scope.matchPassword(function() {
      Auth.signup(vm.user)
      .then(function(){
        $location.path('/profile');
      })
      .catch(function(err){
        vm.error = err.data.error;
      });
    });
  };
  $scope.matchPassword = function(pass) {
    if(vm.user.password !== vm.user.confirmPassword) {
      if(vm.user.confirmPassword) {
        vm.error = "Your passwords do not match.";
      } else {
        vm.error = "You must confirm your password in order to sign up.";
      }
    } else if (pass) {  //run pass if pass exists
      pass();
    } else if(vm.user.password === vm.user.confirmPassword) {
      vm.error = '';
    }
  };
});
