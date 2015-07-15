var Tweet = require('../tweets/tweetModel.js'),
  db = require('../../server/db/schema.js'),
  async = require('async');

var saveToDB = function(tweet, callback) {
  var parsedTweet = {
    tweetId: tweet.id_str,
    userId: tweet.user.id_str,
    entities: JSON.stringify(tweet.entities),
    tweetCreatedAt: tweet.created_at, //TODO : This needs to be formatted correctly as a date
    text: tweet.text,
    source: tweet.source
  };

  if (!!tweet.coordinates) {
    parsedTweet.longitude = tweet.coordinates.coordinates[0];
    parsedTweet.latitude = tweet.coordinates.coordinates[1];
  }

  //TODO: add sentiment analysis stuff
  try {
    new Tweet(parsedTweet)
      .save()
      .then(function(tweet) {
        if (tweet) {
          return callback();
        } else {
          next(new Error('Could not save tweet to the Database!'));
          return callback();
        }
      });
  } catch (err) {
    console.log('parsedTweet:', parsedTweet);
    console.log('error:', err);
  }
};

var deleteFromDB = function(deleteMessage, callback) {
  new Tweet({
      idStr: deleteMessage.status.id_str
    })
    .fetch()
    .then(function(tweet) {
      if (tweet) {
        tweet.destroy();
      } else {
        this.enQ(deleteMessage);
      }
    });
};

// var nullifyGeoData = function(tweet, callback) {
//   new Tweet({
//     userId: scrubGeoMessage.scrub_geo.user_id 
//   })
//   .fetchAll(function(tweets) {
//     tweets.forEach(function(tweet) {
//       tweet.latitude = null;
//       tweet.longitude = null;
//     });
//     tweets.save().then(function() {
//       console.log('tweets geo data updated to NULL');
//       return callback();
//     });
//   });
// };

module.exports.insertionQ = async.queue(saveToDB, 10);
// module.exports.deletionQ = async.queue(deleteFromDB, 10);
// module.exports.scrubGeoQ = async.queue(nullifyGeoData, 10);