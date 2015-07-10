var db = require('../db/schema');
var utils = require('../config/utils.js');

var User = db.Model.extend({
  tableName: 'User',
  hasTimestamps: true,
  defaults: {
    email: ''
  },
  initialize: function() {
    this.on('creating', function(model, attrs, options) {
      //TODO this does not gaurentee uniqueness 
      this.set("apiKey", utils.generateApiKey());

      //TODO
      // this.set("salt", '');
    });
  }
});

module.exports = User;