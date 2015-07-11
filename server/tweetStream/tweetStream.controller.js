var Twit = require('twit');
var StreamHelpers = require('StreamHelpers.js');
var T = new Twit(require('./config/twitterAPICredentials.js'));

var Stream = function(options) {
  this.stream = new T.stream('statuses/filter', options);
  //create a stopwatch
  this.queue = [];

  /* Handle events related to Twitter Streaming API protocol */
  this.stream.on('delete', function(deleteMessage) {
    StreamHelpers.deleteTweet(deleteMessage.status.id);
  });

  this.stream.on('limit', function(limitMessage) {
    //deal with limit message
  });

  this.stream.on('scrub_geo', function(scrubGeoMessage) {
    //delete geo info from status
  });

  /* Processing data */
  this.stream.on('tweet', function(tweet) {
    console.log(tweet); //this is temporary
    /*
      In an ideal world...
        - tweets are sent to a separate server process

      "Separate server process"
        - parse tweet
        - run sentiment analysis on the tweet text (without hashtags?)
        - save tweet to DB with sentiment
    */
  });

  /* */
  //at an interval (every 10 minutes?) on the stopwatch
    //disconnect stream
    //dequeue n search terms
    //reconnect stream with first 400 search terms in the queue?

};

Stream.prototype.enQ = function(searchTerm) {
  this.queue.unshift(searchTerm);
};

Stream.prototype.dQ = function() {
  this.queue.shift();
}