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
};

//TODO fix this to delete tweets from DB correctly
var deleteFromDB = function(deleteMessage, callback) {
  new Tweet({
      tweetId: deleteMessage.delete.status.id_str
    })
    .fetch()
    .then(function(tweet) {
      if (tweet) {
        tweet.destroy();
        console.log('Successfully DELETE');
        callback();
      } else {
        deletionQ.push(deleteMessage);
        callback();
      }
    });
};

var nullifyGeoData = function(tweet, callback) {
  new Tweet({
    userId: scrubGeoMessage.scrub_geo.user_id 
  })
  .fetchAll(function(tweets) {
    tweets.forEach(function(tweet) {
      tweet.latitude = null;
      tweet.longitude = null;
    });
    tweets.save().then(function() {
      console.log('tweets geo data updated to NULL');
      return callback();
    });
  });
};

module.exports.addEventually = function(tweet) {
  insertionQ.push(tweet);
};

module.exports.deleteEventually = function(deleteMessage) {
  deletionQ.push(deleteMessage);

  if(deletionQ.length() < 10) {
    deletionQ.pause();
  }

  if(deletionQ.length() > 10 && deletionQ.paused) {
    deletionQ.resume();
  }
};

module.exports.scrubGeoEventually = function(scrubGeoMessage) {
  scrubGeoQ.push(scrubGeoMessage);

  if(scrubGeoQ.length() < 10) {
    scrubGeoQ.pause();
  }

  if(scrubGeoQ.length() > 10 && scrubGeoQ.paused) {
    scrubGeoQ.resume();
  }
};

var insertionQ = async.queue(saveToDB, 10);
module.exports.insertionQ = insertionQ;
var deletionQ = async.queue(deleteFromDB, 1);
deletionQ.pause(); //don't start deletionQ until there are 10 delete messages present
var scrubGeoQ = async.queue(nullifyGeoData, 1);
scrubGeoQ.pause();
