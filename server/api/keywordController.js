var Keyword = require('./keywordModel.js'),
  User = require('../users/userModel.js'),
  KeywordUser = require('./keywordUserModel.js'),
  StreamingServer = require('./streamingServerModel.js'),
  db = require('../db/schema.js'),
  _ = require('underscore'),
  Promise = require('bluebird');

var ONE_HOUR = 60 * 60 * 1000;
var TWENTY_MINUTES = 20 * 60 * 1000;
var ONE_MINUTE = 60 * 1000;

var addKeywordUser = function(apiKey, keyword, callback) {
  new User({
      apiKey: apiKey
    })
    .fetch()
    .then(function(user) {
      new KeywordUser({
        keyword_id: keyword.get('id'),
        user_id: user.get('id')
      }).upsert(callback);
    });
};

var getRegisteredStreams = function(callback) {
  now = new Date();new StreamingServer()
    .query('where', 'registered', '=', true) //get all streams that were used recently
    .fetchAll()
    .then(function(collection) {
      var streams = [];

      collection.forEach(function(stream) {
        streams.push(stream.get('key'));
      });

      callback(streams);
    });
};

var registeredStreams = [];
var nextStream = 0;

module.exports = {

  // This is inside module.exports so that we can test it in keywordControllerTests.js
  getLeastUsedStream: function(callback) {
    getRegisteredStreams(function(registeredStreams) {

      new Keyword()
        .fetchAll()
        .then(function(collection) {

          var streamIds = [];   //stores just the stream ids

          //add the registered streams. This will ensure every possible stream 
          //can be considered as the least used, even if the stream is empty
          registeredStreams.forEach(function(stream) {
            streamIds.push(stream);
          });

          //parsing the stream ids out of the collection
          collection.forEach(function(stream) {
            streamIds.push(stream.get('streamId'));
          });

          var groups = _.groupBy(streamIds, function(stream) {
            return stream;
          });

          var leastUsedStream = {
            stream: '',
            count: Number.MAX_VALUE
          };

          //find least used
          _.each(groups, function(item, key) {

            if(groups[key].length < leastUsedStream.count) {
              leastUsedStream.stream = key;
              leastUsedStream.count = groups[key].length;
            }
          });

          callback(leastUsedStream.stream);
        });

    });
  },

  // Right now, we are aren't checking to see if this api_key was given to us by an authenticated user.
  // What if Alice sends a GET request with Bob's API key? Is that a problem?
  // Either way, we need to at least check and see if this api_key is valid.
  // It might be best to do that in middleware in the route, so if someone
  // makes it to this function, we don't need to worry about the key inside this function.™
  addKeyword: function(req, res, next) {
    var keyword = req.query.keyword,
      apiKey = req.query.apiKey;

    module.exports.getLeastUsedStream(function(leastUsedStream) {

      new Keyword({
        keyword: keyword
      })
      .fetch()
      .then(function(exists) {
        if (exists) {
          addKeywordUser(apiKey, exists, function() {
            res.send("Added " + keyword + " and " + apiKey + " to database.");
          });
        } else {

          new Keyword({
            keyword: keyword,
            streamId: leastUsedStream
          })
          .save()
          .then(function(keywordModel) {
            addKeywordUser(apiKey, keywordModel, function() {
              res.send("Inserted " + keywordModel + " and " + apiKey + " to database.");
            });
          });
        }
      });
    });
  },

  deleteKeyword: function(req, res, next) {
    var keyword = req.query.keyword,
      userId = req.query.userId;

    new Keyword({
        keyword: keyword
      })
      .fetch()
      .then(function(keyword) {
        if (keyword) {

          new KeywordUser({})
            .query({
              where: {
                keyword_id: keyword.get('id'),
                user_id: userId
              }
            }).destroy();

          keyword.hasZeroUser(function() {
              keyword.destroy().then(function() {

                res.status(200).send('Removed keyword');
              });
            },
            function() {
              res.status(200).send('Removed keyword');
            });
        } else {
          next(new Error('Keyword does not exist for this user'));
        }
      });
  },

  getKeywords: function(req, res, next) {
    var streamId = req.query.streamId;
    var resultArray = [];
    new Keyword()
      .query('where', 'streamId', '=', streamId)
      .fetchAll()
      .then(function(results) {
        resultArray = results.map(function(el) {
          return el.get('keyword');
        });

        res.status(200).send(resultArray);
      });
  }
};
