var request = require('request'),
  fs = require('fs'),
  Twit = require('twit'),
  Timer = require('timer-stopwatch'),
  API_ADDRESS = process.env.API_ADDRESS || '127.0.0.1',
  HANDLER_ADDRESS = process.env.HANDLER_ADDRESS || '127.0.0.1',
  API_PORT = process.env.API_PORT || 8000, 
  HANDLER_PORT = process.env.HANDLER_PORT || 6000; //All handler 
var credentials;

// try {
//   stats = fs.lstatSync('./config.js');
//   if (stats.isDirectory()) {
//     credentials = require('./config');
//   } else {
//     credentials = {
//       consumer_key: process.env.CONSUMER_KEY, 
//       consumer_secret: process.env.CONSUMER_SECRET, 
//       access_token: process.env.ACCESS_TOKEN, 
//       access_token_secret: process.env.TOKEN_SECRET
//     };
//   }
// }
var T = new Twit(credentials);

//spin up server
//start a stopwatch 
//during each interval: 
// 1. get list of keywords from API
// 2. open up streaming connection to twitter w/ those keywords
// 3. start mining data

//at the end of interval
// 1. close streaming connection
// 2. delay of 10s, get new keywords
// 3. open new streaming connection w new keywords

//say there are no keywords
//option 1: turn on sample
//option 2: get tweets by current popular trends? 

var startTimer = function() {
  return new Timer(15 * 1000 * 60, {
    almostDoneMS: 10000
  });
};

var timer = startTimer();
stream = null;

timer.on('almostdone', function() {
  stream.stop();
});

timer.on('done', function() {
  timer = startTimer();
  startStream();
});

var startStream = function() {
  // var options = {
  //   'method': 'GET',
  //   'uri': API_ADDRESS + ':' + API_PORT + '/getKeywords',
  // };

  // request(options, function(error, res, body) {
  //   if (error) {
  //     console.error(error);
  //   } else if (body === null) {
  //     stream = T.stream('statuses/sample');
  //     initStream(stream);
  //   } else {
  //     stream = T.stream('statuses/filter', {
  //       track: trackArray 
  //     });
  //     initStream(stream);
  //   }
  // });
  
  stream = T.stream('statuses/sample');

  initStream(stream);
};

var initStream = function(stream) {
  stream.on('tweet', function(tweet) {
    //make a POST request to tweet handler, with tweet contents
    var options = {
      'method': 'POST',
      'uri': 'http://' + HANDLER_ADDRESS + ':' + HANDLER_PORT + '/tweets',
      'json': tweet
    };

    request(options, function(error, res, body) {
      if (error) {
        console.error(error);
      }
    });
  });

  stream.on('delete', function(deleteMessage) {
    //make a DELETE request to tweet handler, with deleteMessage
    var options = {
      'method': 'DELETE',
      'uri': 'http://' + HANDLER_ADDRESS + ':' + HANDLER_PORT + '/tweets',
      'json': deleteMessage
    };

    request(options, function(error, res, body) {
      if (error) {
        console.error(error);
      }
    });
  });

  stream.on('scrub_geo', function(scrubGeoMessage) {
    //make a POST request to tweet handler, with geoMessage
    var options = {
      'method': 'POST',
      'uri': 'http://' + HANDLER_ADDRESS + ':' + HANDLER_PORT + '/tweets/scrubGeo',
      'json': scrubGeoMessage
    };
  });

  stream.on('reconnect', function(request, response, connectInterval) {
    console.log(request, response, connectInterval);
  });
};

startStream();
