var User = require('../../../server/users/userModel.js');
var db = require('../../../server/db/schema.js');
var Q = require('q');
var should = require('chai').should();

/**
 * Describes how a user should work
 * @class
 */

describe('User', function() {

  var user;
  var PASS = 'password';
  var USER = 'user';
  var EMAIL = 'test@gmail.com';

  //create the user then call the it functions
  beforeEach(function(next) {
    db.truncateAllTables(function() {
      new User({
          username: USER,
          password: PASS,
          email: EMAIL
        })
        .save()
        .then(function(model) {
          user = model;
          next();
        });
    });
  });

  it('should create a user', function() {
    should.exist(user);
  });

  it('should create an api key', function() {
    should.exist(user.get('apiKey'));
    user.get('apiKey').should.not.equal('');
  });

  it('should compare correct passwords', function(next) {
    user
      .comparePassword(PASS, function(isMatch) {
        isMatch.should.equal(true);
        next();
      });
  });

  it('should compare incorrect passwords', function(next) {
    user
      .comparePassword('notthepass', function(isMatch) {
        isMatch.should.equal(false);
        next();
      });
  });

});
