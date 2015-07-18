var db = require('../db/schema.js'),
  queue = require('../utils/queue.js'),
  utils = require('../config/utils.js');

module.exports = {
  getKey: function(req, res, next) {
    //TODO: set token header on frontend AJAX request
    var username = req.query.username;
        // session_token = req.headers['x-access-token'],
        // app_name = req.query.app_name;

    utils.getApiKey(username, function(apiKey) {
      if(apiKey) {
        res.status(200).json({
          apiKey: apiKey
        });
      }
    });
  },

  getSearch: function(req, res, next) {
    var keyword = req.query.keyword,
        api_key = req.query.api_key;

    //log request based on apiKey, check for api key

    //return all tweets associated with keyword
    utils.searchDbForTweets(keyword, function(tweetArray) {
      res.status(200).send(tweetArray);
    });
  },

  // getLocation: function(req, res, next) {
  //   var location_value = req.query.location_value,
  //   //QUESTION: can keyword be null?
  //     keyword = req.query.keyword;
  //     api_key = req.query.api_key;

  //   console.log('location_value: ' + location_value);
  //   console.log('keyword: ' + keyword);
  //   console.log('api_key: ' + api_key);
  // },

  getSentiment: function(req, res, next) {
    //QUESTION: should be either positive/negative or something else?
    var sentiment = req.query.sentiment,
        keyword = req.query.keyword;
        api_key = req.query.api_key;

    utils.getTweetsBySentiment(keyword, sentiment, function(tweetArray) {
      res.status(200).send(tweetArray);
    });
  },

  getTime: function(req, res, next) {
    var time_range = req.query.time_range,
      keyword = req.query.keyword;
      api_key = req.query.api_key;

    console.log('time_range: ' + time_range);
    console.log('keyword: ' + keyword);
    console.log('api_key: ' + api_key);
  }
};
