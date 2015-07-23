/**
 * factory to interact with backend server for authentication
 * @class
 */
angular.module('queryFactory', [])
.factory('QueryBuilder', function($http, $location, $window){
  var queryBuilder = {};

  queryBuilder.httpVerb = 'GET';
  queryBuilder.apiKey = 'Your_API_Key';
  queryBuilder.keyword = 'Pizza';
  queryBuilder.sentiment = 'Positive';
  queryBuilder.startTime = '1437601158544';
  queryBuilder.endTime = '1437601177216';

  return queryBuilder;
});
