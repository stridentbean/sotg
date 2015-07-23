/**
 * factory to interact with backend server for authentication
 * @class
 */
angular.module('queryFactory', [])
.factory('QueryBuilder', function($http, $location, $window){
  var queryBuilder = {};

  queryBuilder.makeQuery = function(queryURL, httpMethod, callback) {
    return $http({
      method: httpMethod, 
      url: queryURL
    })
    .success(function(data) {
      callback(data);
    })
    .error(function(data){
      callback(data);
    });
  };

  return queryBuilder;
});
