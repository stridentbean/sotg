angular.module('queryBuilderCtrl', [])
.controller('queryBuilderController', function(Auth, $location, $window, $state) {
  var vm = this;
  vm.$state = $state;
  console.log(vm.$state.is('queryBuilder.search'));
});
