angular.module('profileCtrl', [])
.controller('profileController', function(Auth, $location, $window) {
  var vm = this;
  Auth.profile()
  .then(function(res){
      vm.username = res.data.username; 
      vm.apiKey = res.data.apiKey;
      vm.keywords = res.data.keywords;
    })
    .catch(function(err){
      vm.error = 'You must be logged in to see this page';
    });
});
