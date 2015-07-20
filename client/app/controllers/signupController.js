angular.module('signupCtrl', [])
.controller('signupController', function(Auth, $location, $window) {
  var vm = this;
  vm.user = {};
  vm.signUpUser = function(){
    console.log(vm.user);
    Auth.signup(vm.user)
    .then(function(){
      $location.path('/profile');
    })
    .catch(function(err){
      console.log(err);
    });
  };
});
