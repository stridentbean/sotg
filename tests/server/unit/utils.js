var Utils = require('../../../server/config/utils.js'),
  User = require('../../../server/users/userModel.js'),
  ApiTransaction = require('../../../server/apiTransactions/apiTransactionModel.js'),
  Keyword = require('../../../server/api/keywordModel.js'),
  StreamingServer = require('../../../server/api/streamingServerModel.js'),
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

  describe('Keyword Utils', function() {

    describe('getRegisteredStreams', function() {
      //insert user into database
      before(function(done) {
        db.truncateAllTables(function() {
          done();
        });
      });

      it('should find no registered streams', function(done) {
        new StreamingServer({
            registered: false
          })
          .save()
          .then(function(model) {

            Utils.getRegisteredStreams(function(streams) {
              streams.length.should.equal(0);
              done();
            });
          });
      });

      it('should find one registered streams', function(done) {
        new StreamingServer({
            registered: true
          })
          .save()
          .then(function(model) {
            Utils.getRegisteredStreams(function(streams) {
              streams.length.should.equal(1);
              done();
            });
          });
      });

      it('should find many registered streams', function(done) {
        new StreamingServer()
          .save()
          .then(function(model1) {

            new StreamingServer({
                registered: true
              })
              .save()
              .then(function(model2) {

                new StreamingServer()
                  .save()
                  .then(function(model3) {
                    Utils.getRegisteredStreams(function(streams) {
                      streams.length.should.equal(2);
                      done();
                    });
                  });
              });
          });
      });
    });

    describe('getLeastUsedStream', function() {
      var streamId1;
      var streamId2;

      //insert user into database
      before(function(done) {
        db.truncateAllTables(function() {
          done();
        });
      });

      it('should find the least used stream of 1 registered stream', function(done) {
        new StreamingServer({
            registered: true
          })
          .save()
          .then(function(streamingModel) {
            
            streamId1 = streamingModel.get('key');

            new Keyword({
                streamId: streamId1,
                keyword: 'usa'
              })
              .save()
              .then(function(keywordModel) {

                Utils.getLeastUsedStream(function(stream) {
                  stream.should.be.a('object');
                  stream.key.should.equal(streamingModel.get('key'));
                  
                  done();
                });
              });
          });
      });

      it('should find the least used stream of 1 registered and 1 unregistered streams', function(done) {
        new StreamingServer({
            registered: false
          })
          .save()
          .then(function(streamingModel) {

            Utils.getLeastUsedStream(function(stream) {
              stream.should.be.a('object');
              stream.key.should.be.a('string');
              stream.key.should.equal(streamId1);

              streamId2 = streamingModel.get('key');
              done();
            });
          });
      });

      it('should find the least used stream of 2 registered and 1 unregistered streams', function(done) {

        new StreamingServer({
            registered: true
          })
          .save()
          .then(function(streamingModel) {

            new Keyword({
                streamId: streamId2,
                keyword: 'cola'
              })
              .save()
              .then(function(keywordModel) {

                Utils.getLeastUsedStream(function(stream) {
                  stream.should.be.a('object');
                  stream.key.should.be.a('string');
                  stream.key.should.equal(streamId1);
                  done();
                });
              });
          });
      });
    });
  });

});
