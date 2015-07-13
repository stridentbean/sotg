var Tweet = require('./tweetModel.js'), 
    db = require('../../server/db/schema.js');

/**
 * A module that handles all tweet endpoints
 * @module tweets/tweetController
 */

module.exports = {
  handleInsert : function(req, res, next) {
    console.log('handleInsert');
  }, 

  handleDelete : function(req, res, next) {
    console.log('handleDelete');
  }, 

  handleScrubGeo : function(req, res, next) {
    console.log('handleScrubGeo');
  }
};