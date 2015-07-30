var db = require('../db/schema'),
  Keyword = require('./keywordModel.js'),
  utils = require('../config/utils.js'),
  request = require('request');
uuid = require('uuid');

var StreamingServers = db.Model.extend({
  tableName: 'streaming_servers',
  hasTimestamps: true,
  defaults: {
    registered: false
  },
  /** 
   * Initializes the user with a key 
   *@function
   */
  initialize: function() {
    this.on('creating', this.generateKey);
  },

  /**
   * Generates an API Key
   *@function
   */

  generateKey: function() {
    this.set("key", uuid.v4());
  },

  sendToStreamingServer: function(keyword, callback) {
    var options = {
      'method': 'POST',
      'uri': 'http://' + this.get('ip') + ':' + this.get('port') + '/api/keywords?key=' + this.get('key') + '&keyword=' + keyword
    };
    request(options, function(err, res, body) {
      if (callback) {
        callback(res !== undefined && (res.statusCode === 200 || res.statusCode === 201));
      }
    });

  },

  deleteFromStreamingServer: function(keyword, callback) {

    var options = {
      'method': 'DELETE',
      'uri': 'http://' + this.get('ip') + ':' + this.get('port') + '/api/keywords?key=' + this.get('key') + '&keyword=' + keyword
    };
    request(options, function(err, res, body) {
      if (callback) {
        callback(res !== undefined && (res.statusCode === 204));
      }
    });

  },

  register: function() {
    console.log('streaming server register');
    this.set('registered', true);
  },

  unregister: function() {
    console.log('streaming server unregister');
    this.set('registered', false);
    this.set('ip', null);
    this.set('port', null);

    //find all keywords with this streamId
    new Keyword()
      .query('where', 'streamId', '=', this.get('key'))
      .fetchAll()
      .then(function(keywordCollection) {
        keywordCollection.forEach(function(keywordModel) {
          utils.getLeastUsedStream(function(stream) {

            var streamId = null;
            if (stream) {
              streamId = stream.key;
            }
            keywordModel.set('streamId', streamId);
            keywordModel
              .save()
              .catch(function(err) {
                if(err.message === 'No Rows Updated') {

                } else {
                  throw err;
                }
              });
          });
        });
      });
  },

  resetKeywordsWithNullStream: function() {
    console.log('streaming server reset');

    //find all keywords with this streamId
    new Keyword()
      .query({
        whereNull: 'streamId'
      })
      .fetchAll()
      .then(function(keywordCollection) {
        console.log('keywordCollection', keywordCollection.length);
        keywordCollection.forEach(function(keywordModel) {
          utils.getLeastUsedStream(function(stream) {

            var streamId = null;
            if (stream) {
              streamId = stream.key;
            }
            keywordModel.set('streamId', streamId);
            keywordModel.save();
          });
        });
      });
  }
});

module.exports = StreamingServers;
