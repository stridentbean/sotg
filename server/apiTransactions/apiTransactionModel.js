var db = require('../db/schema'),
  User = require('../users/userModel.js');

var ApiTransaction = db.Model.extend({
  tableName: 'ApiTransaction',
  hasTimestamps: true,
  defaults: {},
  user: function() {
    return this.hashOne(User);
  }
});

module.exports = ApiTransaction;
