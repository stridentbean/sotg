angular.module('queryBuilderCtrl', [])
.controller('queryBuilderController', function(Auth, QueryBuilder, $location, $window, $state, $scope) {
  var vm = this;
  $scope.$state = $state;

  Auth.profile()
  .then(function(res){
      $scope.isAuth = true;
      $scope.apiKey = res.data.apiKey;
    })
    .catch(function(err){
      $scope.isAuth = false;
      $scope.apiKey = 'Your_API_Key';
    });
  $scope.apiKey = 'Your_API_Key';
  $scope.keyword = 'Pizza';
  $scope.sentiment = 'positive';
  $scope.httpVerb = 'GET';
  $scope.startTime = new Date();
  $scope.endTime = new Date();
  $scope.startTimeMS = $scope.startTime.getTime();
  $scope.endTimeMS = $scope.endTime.getTime();

  $scope.startTimeConvert = function() {
    $scope.startTimeMS = $scope.startTime.getTime();
  }; 

  $scope.endTimeConvert = function() {
    $scope.endTimeMS = $scope.endTime.getTime();
  } 
});
