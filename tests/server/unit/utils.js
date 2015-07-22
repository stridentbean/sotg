var Utils = require('../../../server/config/utils.js'),
  User = require('../../../server/users/userModel.js'),
  ApiTransaction = require('../../../server/apiTransactions/apiTransactionModel.js'),
  db = require('../../../server/config/db.js'),
  should = require('chai').should();

/**
 * Describes how Utils should work
 * @class
 */

describe('Utils', function() {

  describe('validateEmail', function() {

    it('should validate correct emails', function() {
      Utils.validateEmail('blarg@gmail.com').should.equal(true);
    });

    it('should invalidate correct emails', function() {
      Utils.validateEmail('blarggmailcom').should.equal(false);
      Utils.validateEmail('blarg@gmailcom').should.equal(false);
      Utils.validateEmail('blarggmail.com').should.equal(false);
      Utils.validateEmail('blarg;gmail.com').should.equal(false);
    });

  });

  describe('insertApiTransaction', function() {

    var user;
    var PASS = 'password';
    var USER = 'user';
    var routeOne = '/api/keywords/';
    var methodOne = 'post';

    //insert user into database
    before(function(done) {
      db.truncateAllTables(function() {
        new User({
            username: USER,
            password: PASS
          })
          .save()
          .then(function(model) {
            user = model;
            done();
          });
      });
    });

    it('should insert a transaction', function(done) {
      Utils.insertApiTransaction(methodOne, routeOne, user, new Date(), function() {

        new ApiTransaction({
            userId: user.get('id')
          })
          .fetchAll()
          .then(function(apiTransactions) {
            should.exist(apiTransactions);
            done();
          });
      });

    });

    it('should execute without a callback', function(done) {
      try {
        Utils.insertApiTransaction(methodOne, routeOne, user, new Date());
      } catch (err) {
        should.not.exist(err);
      }
      //this forces the test to be listed when grunt test is run
      true.should.equal(true);
      done();
    });
  });

});
