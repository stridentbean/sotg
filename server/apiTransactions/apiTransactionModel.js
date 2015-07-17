var db = require('../db/schema');

var ApiTransaction = db.Model.extend({
  tableName: 'ApiTransaction',
  hasTimestamps: true,
  defaults: {}
});

module.exports = ApiTransaction;
