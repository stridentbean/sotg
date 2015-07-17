var _ = require('underscore'),
  db = require('../db/schema.js'),
  User = require('../users/userModel.js'),
  ApiTransaction = require('../apiTransactions/apiTransactionModel.js'),
  uuid = require('uuid');

/**
 * A module of commonly used functions
 * @module config/utils
 */


/**
 * Checks to ensure users are not assigned the same API key.
 *@function
 */
var checkforAPIKey = module.exports.checkforAPIKey = function(apiKey) {
  new User({
      apiKey: apiKey
    })
    .fetch()
    .then(function(user) {
      if (user) {
        return true;
      } else {
        return false;
      }
    });
};

/**
 * Generates a new API Key
 *@function
 */
var generateApiKey = module.exports.generateApiKey = function() {
  return uuid.v4();
};

/**
 * Inserts an ApiTransaction for the route and user
 *@function
 *@arg route {string} The api route
 *@arg user {User} The user making the api call
 */
var insertApiTransaction = module.exports.insertApiTransaction = function(route, user, done) {

    new ApiTransaction({
        userId: user.get('id'),
        route: route
      })
      .save()
      .then(function(apiTransaction) {


        //if there is a callback, call it 
        if (!!done) {
          done();
        }
      });
};

/**
 * Validates an email address
 *@function
 *@arg email {string} The email to be considered
 */
var validateEmail = module.exports.validateEmail = function(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
};
