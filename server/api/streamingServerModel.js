var db = require('../db/schema'),
  Keyword = require('./keywordModel.js'),
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
    console.log(this);
    var options = {
      'method': 'POST',
      'uri': 'http://' + this.get('ip') + ':' + this.get('port') + '/api/keywords?key=' + this.get('key') + '&keyword=' + this.get('keyword')
    };
    console.log('sending', options.uri);
    request(options, function(err, res, body) {
      if (callback) {
        callback(res.statusCode === 200 || res.statusCode === 201);
      }
    });

  },

  deleteFromStreamingServer: function(keyword, callback) {

    var options = {
      'method': 'DELETE',
      'uri': 'http://' + this.get('ip') + ':' + this.get('port') + '/api/keywords?key=' + this.get('key') + '&keyword=' + this.get('keyword')
    };
    request(options, function(err, res, body) {
      if (callback) {
        callback(res.statusCode === 204);
      }
    });

  },
});

module.exports = StreamingServers;
