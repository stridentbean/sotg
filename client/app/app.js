var essoteegeeApp = angular.module('essoteegeeApp', ['ui.router']);
essoteegeeApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider){
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
  $stateProvider
    .state('/',{
      url: '/',
      templateUrl: 'app/views/home.html'
    });

});
