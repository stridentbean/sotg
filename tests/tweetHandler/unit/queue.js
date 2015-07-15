var Tweet = require('../../../tweetHandler/tweets/tweetModel.js'),
  db = require('../../../server/db/schema.js'),
  queues = require('../../../tweetHandler/config/queue.js'),
  should = require('chai').should();

/**
 * Describes async queues
 * @class
 */

describe('Queues', function() {

  // before(function(next) {
  //   db.truncateAllTables(function(){
  //     next();
  //   });

  // });

  // describe('Insertion Queue', function() {

  //   beforeEach(function(next) {
  //     var insertionQ = new queue();
  //     next();
  //   });

  //   it('should insert a tweet into the DB', function() {

  //   });

  // });

  it('should have an async queue for insertion of tweets', function() {
    queues.insertionQ.should.be.an('object');
  });

});