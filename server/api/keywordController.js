var Keyword = require('./keywordModel.js'),
  User = require('../users/userModel.js'),
  KeywordUser = require('./keywordUserModel.js'),
  StreamingServer = require('./streamingServerModel.js'),
  db = require('../db/schema.js'),
  _ = require('underscore');

var registeredStreams = [];
var nextStream = 0;

module.exports = {

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

          //if this is a new keyword
          if (status.code === 1) {
            var keywordModel = status.keywordModel;

            new StreamingServer({
                key: keywordModel.get('streamId')
              })
              .fetch()
              .then(function(streamingModel) {

                //TODO this if is only needed to support unit tests
                if (streamingModel.get('ip') !== null) {

                  streamingModel.sendToStreamingServer(keywordModel.get('keyword'), function(success) {
                    if (success) {
                      streamingModel.register();
                      streamingModel.save();
                    } else {
                      streamingModel.unregister();
                      streamingModel.save();
                      keywordModel.set('streamId', null);
                      keywordModel.save();
                    }
                  });

                }
              });
          }
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

          if (status.code === 0) {
            var keywordModel = status.keywordModel;

            new StreamingServer({
                key: keywordModel.get('streamId')
              })
              .fetch()
              .then(function(streamingModel) {

                //TODO this if is only needed to support unit tests
                if (streamingModel.get('ip') !== null) {

                  streamingModel.deleteFromStreamingServer(keywordModel.get('keyword'), function(success) {
                    if (success) {
                      streamingModel.register();
                      streamingModel.save();
                    } else {
                      streamingModel.unregister();
                      streamingModel.save();
                      keywordModel.set('streamId', null);
                      keywordModel.save();
                    }
                  });
                }

              });
          }
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
