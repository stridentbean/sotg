var db = require('../db/schema');

/**
  * Creates a new Tweet. 
  * @class
  */

var Tweet = db.Model.extend({
  tableName: 'Tweet'
})