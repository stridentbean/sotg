var credentials = require('./config.js')
var Twit = require('twit');

var T = new Twit(credentials);

var stream = T.stream('statuses/filter', {track : ['apple', 'orange', 'fanta', '#yolo']});
 
stream.on('tweet', function (tweet) {
  fs.appendFile('data.json', JSON.stringify(tweet)+'\n', function(err) {
    if(err) console.error(err);
  });
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
