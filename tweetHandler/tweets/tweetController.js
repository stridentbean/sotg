var queues = require('../config/queue.js');

  /**
   * A module that handles all tweet endpoints
   * @module tweets/tweetController
   */

module.exports = {
  handleInsert: function(req, res, next) {
    var tweet = req.body;
    queues.insertionQ.push(tweet);
  },

  handleDelete: function(req, res, next) {
    var deleteMessage = req.body;
    console.log('DELETE MESSAGE');
    console.log(deleteMessage);
    // queues.deletionQ.push(deleteMessage);
  },

  handleScrubGeo: function(req, res, next) {
    var scrubGeoMessage = req.body;
    console.log('SCRUB GEO MESSAGE');
    console.log(scrubGeoMessage);
    // queues.scrubGeoQ.push(scrubGeoMessage);
  }
};
