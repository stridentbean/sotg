angular.module('profileCtrl', [])
.controller('profileController', function(Auth, $location, $window) {
  var vm = this;
  Auth.profile()
  .then(function(){
      console.log('success');
    })
    .catch(function(err){
      $location.path('/');
    });
});
