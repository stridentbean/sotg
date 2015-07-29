var Keyword = require('./keywordModel.js'),
  User = require('../users/userModel.js'),
  KeywordUser = require('./keywordUserModel.js'),
  StreamingServer = require('./streamingServerModel.js'),
  db = require('../db/schema.js'),
  _ = require('underscore');

var registeredStreams = [];
var nextStream = 0;

module.exports = {

  // This is inside module.exports so that we can test it in keywordControllerTests.js
  // getLeastUsedStream: function(callback) {
  //   getRegisteredStreams(function(registeredStreams) {

  //     new Keyword()
  //       .fetchAll()
  //       .then(function(collection) {

  //         var streamIds = [];   //stores just the stream ids

  //         //add the registered streams. This will ensure every possible stream 
  //         //can be considered as the least used, even if the stream is empty
  //         registeredStreams.forEach(function(stream) {
  //           streamIds.push(stream);
  //         });

  //         //parsing the stream ids out of the collection
  //         collection.forEach(function(stream) {
  //           streamIds.push(stream.get('streamId'));
  //         });

  //         var groups = _.groupBy(streamIds, function(stream) {
  //           return stream;
  //         });

  //         var leastUsedStream = {
  //           stream: '',
  //           count: Number.MAX_VALUE
  //         };

  //         //find least used
  //         _.each(groups, function(item, key) {

  //           if(groups[key].length < leastUsedStream.count) {
  //             leastUsedStream.stream = key;
  //             leastUsedStream.count = groups[key].length;
  //           }
  //         });

  //         callback(leastUsedStream.stream);
  //       });

  //   });
  // },

  // Right now, we are aren't checking to see if this api_key was given to us by an authenticated user.
  // What if Alice sends a GET request with Bob's API key? Is that a problem?
  // Either way, we need to at least check and see if this api_key is valid.
  // It might be best to do that in middleware in the route, so if someone
  // makes it to this function, we don't need to worry about the key inside this function.™
  addKeyword: function(req, res, next) {
    var keyword = req.query.keyword,
      apiKey = req.query.apiKey,
      userId = req.query.userId;

    new User({
        id: userId
      })
      .fetch()
      .then(function(userModel) {
        userModel.addKeyword(keyword, function(status) {
          res.status(200).send(status.message);
        });
      });
  },

  deleteKeyword: function(req, res, next) {
    var keyword = req.query.keyword,
      userId = req.query.userId;

    new User({
        id: userId
      })
      .fetch()
      .then(function(userModel) {
        userModel.removeKeyword(keyword, function(status) {
          res.status(200).send(status.message);
        });
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
