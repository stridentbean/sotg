var queues = require('../config/queue.js');

  /**
   * A module that handles all tweet endpoints
   * @module tweets/tweetController
   */

module.exports = {
  handleInsert: function(req, res, next) {
    var tweet = req.body;
    queues.addEventually(tweet);
  },

  handleDelete: function(req, res, next) {
    var deleteMessage = req.body;
    queues.deleteEventually(deleteMessage);
  },

  handleScrubGeo: function(req, res, next) {
    var scrubGeoMessage = req.body;
    queues.scrubGeoEventually(scrubGeoMessage);
  }
};