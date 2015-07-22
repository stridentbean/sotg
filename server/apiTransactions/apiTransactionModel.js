var db = require('../db/schema'),
  User = require('../users/userModel.js');

var ApiTransaction = db.Model.extend({
  tableName: 'api_transactions',
  hasTimestamps: true,
  defaults: {},
  user: function() {
    return this.hashOne(User);
  }
});

module.exports = ApiTransaction;
