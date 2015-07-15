var db = require('../../server/db/schema');

var HashTag = db.Model.extend({
  tableName: 'HashTag',
  defaults: {},
});

module.exports = HashTag;
