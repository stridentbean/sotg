var User = require('../../../server/users/userModel.js'),
  StreamingServer = require('../../../server/api/streamingServerModel.js'),
  Keyword = require('../../../server/api/keywordModel.js'),
  db = require('../../../server/config/db.js'),
  Q = require('q'),
  should = require('chai').should();

/**
 * Describes how a Streaming Server should work
 * @class
 */

describe('StreamingServer', function() {

  var streamingModel1, streamingModel2;
  var keyword1 = 'keyword1', keyword2 = 'keyword2';

  //create the user then call the it functions
  before(function(next) {
    db.truncateAllTables(function() {
      new StreamingServer({
          registered: true,
          ip: '127.0.0.1',
          port: '5000',
          key: '8d2f2682-6d7b-4183-9464-cd52840d3000'
        })
        .save()
        .then(function(streamingModel) {
          streamingModel1 = streamingModel;
          next();
        });
    });
  });

  it('should create a streamingModel', function() {
    should.exist(streamingModel1);
  });

  it('should be able to re register', function(next) {
    streamingModel1.register();
    streamingModel1
      .save()
      .then(function(streamingModel) {
        streamingModel.get('registered').should.equal(true);

        next();
      });
  });

  it('should be able to un register', function(next) {
    streamingModel1.unregister();
    streamingModel1
      .save()
      .then(function(streamingModel) {
        streamingModel.get('registered').should.equal(false);
        should.not.exist(streamingModel.get('ip'));
        should.not.exist(streamingModel.get('port'));

        next();
      });
  });

  it('it should have keywords', function(next) {
    new StreamingServer({
        registered: true,
        ip: '127.0.0.1',
        port: '5000',
        key: '8d2f2682-6d7b-4183-9464-cd52840d3111'
      })
      .save()
      .then(function(streamingModel) {
        streamingModel2 = streamingModel;

        new Keyword({
            streamId: streamingModel.get('key'),
            keyword: keyword1
          })
          .save()
          .then(function(keywordModel2) {
            new Keyword({
                streamId: streamingModel.get('key'),
                keyword: keyword2
              })
              .save()
              .then(function(keywordModel2) {
                next();
              });
          });
      });
  });

  it('it should unregister those keywords', function() {
    streamingModel2.unregister();
    
  });
});
