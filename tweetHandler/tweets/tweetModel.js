var db = require('../../server/db/schema');
var HashTag = require('../hashTags/HashTag.js');

var Tweet = db.Model.extend({
  tableName: 'Tweet',
  defaults: {},
  hashTags: function() {
    return this.hasMany(HashTags);
  }
});

module.exports = Tweet;
