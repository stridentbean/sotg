var db = require('../db/schema.js'),
  queue = require('../utils/queue.js');

module.exports = {
  getKey: function(req, res, next) {
    //QUESTION: might not need this?
    // var username = req.query.username;

    //TODO: set token header on frontend AJAX request
    var session_token = req.headers['x-access-token'],
      app_name = req.query.app_name;

    //for testing purposes
    console.log('session_token: ' + session_token);
    console.log('app_name: ' + app_name);
  },
  getSearch: function(req, res, next) {
    var keyword = req.query.keyword,
      api_key = req.query.api_key;

    console.log('keyword: ' + keyword);
    console.log('api_key: ' + api_key);
  },
  getLocation: function(req, res, next) {
    var location_value = req.query.location_value,
    //QUESTION: can keyword be null?
      keyword = req.query.keyword;
      api_key = req.query.api_key;

    console.log('location_value: ' + location_value);
    console.log('keyword: ' + keyword);
    console.log('api_key: ' + api_key);
  },
  getSentiment: function(req, res, next) {
    //QUESTION: should be either positive/negative or something else?
    var sentiment_value = req.query.sentiment_value,
      keyword = req.query.keyword;
      api_key = req.query.api_key;

    console.log('sentiment_value: ' + sentiment_value);
    console.log('keyword: ' + keyword);
    console.log('api_key: ' + api_key);
  },
  getTime: function(req, res, next) {
    var time_range = req.query.time_range,
      keyword = req.query.keyword;
      api_key = req.query.api_key;

    console.log('time_range: ' + time_range);
    console.log('keyword: ' + keyword);
    console.log('api_key: ' + api_key);
  },
  addKeyword: function(req, res, next) {
    var keyword = req.query.keyword,
      // Right now, we are aren't checking to see if this api_key was given to us by an authenticated user.
      // What if Alice sends a GET request with Bob's API key? Is that a problem?
      // Either way, we need to at least check and see if this api_key is valid.
      // It might be best to do that in middleware in the route, so if someone
      // makes it to this function, we don't need to worry about the key inside this function.™
      api_key = req.query.api_key; 

    //pushes keywords to the queue for the streaming server to retrieve  
    queue.checkDuplicates(keyword);
    
    console.log('keyword: ' + keyword);
    console.log('api_key: ' + api_key);
    console.log('called addKeyword');
    res.send('success');
  },
  getKeywords: function(req, res, next) {
    var api_key = req.query.api_key,
      number = req.query.number;
      //gets keywords from queue
    console.log('called before getkeywords');
      var keywords = queue.dequeue(number);

    console.log('api_key: ' + api_key);
    console.log('number: ' + number);
    console.log('called getKeywords');
    //sends keywords from queue to streaming server
    res.send(keywords);
  }
};
