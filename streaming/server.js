var credentials = require('./config.js'), 
    request = require('request'), 
    Twit = require('twit'), 
    Timer = require('timer-stopwatch'),
    PORT = process.env.PORT || 6000; //All streaming servers will be on port 6XXX

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
  return new Timer(15*1000*60, { almostDoneMS: 10000 });
}

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
    //request()
    //on success
    stream = T.stream('statuses/filter', track: trackArray);


}
 
stream.on('tweet', function (tweet) {

});

stream.on('delete', function(deleteMessage) {
  fs.appendFile('deleteMessage.json', JSON.stringify(deleteMessage), function(err) {
    if(err) console.error(err);
  });
});

stream.on('limit', function(limitMessage) {
  fs.appendFile('limitMessage.json', JSON.stringify(limitMessage), function(err) {
    if(err) console.error(err);
  });
});

stream.on('scrub_geo', function(scrubGeoMessage) {
  fs.appendFile('scrubGeoMessage.json', JSON.stringify(scrubGeoMessage), function(err) {
    if(err) console.error(err);
  });
});

stream.on('reconnect', function(request, response, connectInterval) {
  console.log(request, response, connectInterval);
});
