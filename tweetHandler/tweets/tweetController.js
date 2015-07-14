var Tweet = require('./tweetModel.js'),
  db = require('../../server/db/schema.js');

/**
 * A module that handles all tweet endpoints
 * @module tweets/tweetController
 */

module.exports = {
  handleInsert: function(req, res, next) {
    var tweet = req.body;
    var parsedTweet = {
      idStr: tweet.id_str,
      userId: tweet.user.id,
      entities: JSON.stringify(tweet.entities),
      tweetCreatedAt: tweet.created_at, //TODO : This needs to be formatted correctly as a date
      text: tweet.text,
      source: tweet.source
    };

    if (!!tweet.coordinates) {
      parsedTweet.longitude = tweet.coordinates.coordinates[0];
      parsedTweet.latitute = tweet.coordinates.coordinates[1];
    }

    new Tweet(parsedTweet)
      .save()
      .then(function(tweet) {
        if (tweet) {
          return tweet;
        } else {
          return next(new Error('Could not save tweet to the Database!'));
        }
      });
  },

  handleDelete: function(req, res, next) {
    console.log('handleDelete');
  },

  handleScrubGeo: function(req, res, next) {
    console.log('handleScrubGeo');
  }
};