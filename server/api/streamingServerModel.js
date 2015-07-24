var db = require('../db/schema'),
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
});

module.exports = StreamingServers;
