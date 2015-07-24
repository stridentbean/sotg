angular.module('profileCtrl', [])
.controller('profileController', function(Auth, QueryBuilder, $location, $window) {
  var vm = this;
  Auth.profile()
  .then(function(res){
      vm.username = res.data.username; 
      vm.apiKey = res.data.apiKey;
      Auth.keywords(vm)
      .then(function(res) {
        vm.keywords = res.data;
      });
    })
    .catch(function(err){
      vm.error = 'You must be logged in to see this page';
    });

    vm.deleteKeyword = function(keyword){
      var queryURL = 'api/keywords?keyword=' + keyword.keyword + '&apiKey=' + vm.apiKey;
      QueryBuilder.makeQuery(queryURL, 'DELETE', function(){})
      .then(function(){
        Auth.keywords(vm)
        .then(function(res) {
          vm.keywords = res.data;
        });
      });
    };

    vm.addKeyword = function() {
      console.log(vm.addKeywordInput);
      var queryURL = 'api/keywords?keyword=' + encodeURIComponent(vm.addKeywordInput) + '&apiKey=' + vm.apiKey;
      QueryBuilder.makeQuery(queryURL, 'POST', function(){})
      .then(function(){
        Auth.keywords(vm)
        .then(function(res) {
          vm.keywords = res.data;
          vm.addKeywordInput = '';
        });
      });
    };
});
