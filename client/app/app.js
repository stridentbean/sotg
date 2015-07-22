var essoteegeeApp = angular.module('essoteegeeApp', ['ui.router', 'sotgFactory',
'loginCtrl', 'signupCtrl', 'profileCtrl', 'logoutCtrl']);
essoteegeeApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider){
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
  $stateProvider
    .state('/',{
      url: '/',
      templateUrl: 'app/views/home.html'
    })
    .state('signup',{
      url: '/signup',
      templateUrl: 'app/views/signup.html'
    })
    .state('login',{
      url: '/login',
      templateUrl: 'app/views/login.html'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'app/views/profile.html'
    })
    .state('logout', {
      controller: 'logoutController'
    })
    .state('documentation', {
      url: '/documentation',
      templateUrl: 'app/views/documentation.html'
    })
    .state('queryBuilder', {
      url: '/queryBuilder', 
      templateUrl: 'app/views/queryBuilder.html'
    });

});
