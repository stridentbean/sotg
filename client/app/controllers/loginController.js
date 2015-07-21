angular.module('loginCtrl', [])
.controller('loginController', function(Auth, $location, $window) {
  var vm = this;
  vm.user = {};
  vm.logInUser = function(){
    console.log(vm.user);
    Auth.login(vm.user)
    .then(function(){
      $location.path('/profile');
    })
    .catch(function(err){
      vm.error = err.data.error;
    });
  };
});
