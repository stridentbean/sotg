angular.module('queryBuilderCtrl', [])
.controller('queryBuilderController', function(Auth, QueryBuilder, $location, $window, $state, $scope) {
  var vm = this;
  $scope.$state = $state;

  Auth.profile()
  .then(function(res){
      $scope.apiKey = res.data.apiKey;
    })
    .catch(function(err){
      $scope.apiKey = 'Your_API_Key';
    });
  $scope.apiKey = 'Your_API_Key';
  $scope.keyword = 'Pizza';
  $scope.sentiment = 'positive';
  $scope.httpVerb = 'GET'
});
