var _ = require('underscore'),
  User = require('../users/userModel.js'),
  ApiTransaction = require('../apiTransactions/apiTransactionModel.js');

/**
 * A module of commonly used functions
 * @module config/utils
 */

module.exports = {

  /**
   * Generates a new API Key
   *@function
   */

  generateApiKey: function() {
    return this.randomString(40, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  },

  /**
   * Creates a random string
   *@function
   *@arg {length} The length of the random string to be generated
   *@arg {chars} A string that contains all the possible random chacters
   */
  randomString: function(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result;
  },

  /**
   * Validates an email address
   *@function
   *@arg email {string} The email to be considered
   */
  validateEmail: function(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  },

  /**
   * Inserts an ApiTransaction for the route and user
   *@function
   *@arg route {string} The api route
   *@arg user {User} The user making the api call
   */
  insertApiTransaction: function(route, user, done) {

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
  }
};
