angular.module('profileCtrl', [])
.controller('profileController', function(Auth, $location, $window) {
  var vm = this;
  Auth.profile()
  .then(function(res){
      console.log(res);
      vm.username = res.data.username; 
      vm.apiKey = res.data.apiKey;
      Auth.keywords(vm)
      .then(function(res) {
        console.log(res.data);
        vm.keywords = res.data;
      });
    })
    .catch(function(err){
      vm.error = 'You must be logged in to see this page';
    });
});
