var db = require('../db/schema.js'),
  queue = require('../utils/queue.js'),
  utils = require('../config/utils.js');

module.exports = {

  getSearch: function(req, res, next) {
    var keyword = req.query.keyword;

    //return all tweets associated with keyword
    utils.searchDbForTweets(keyword, function(tweetArray) {
      res.status(200).send(tweetArray);
    });
  },

  getSentiment: function(req, res, next) {
    //QUESTION: should be either positive/negative or something else?
    var sentiment = req.query.sentiment,
        keyword = req.query.keyword;

    utils.getTweetsBySentiment(keyword, sentiment, function(tweetArray) {
      res.status(200).send(tweetArray);
    });
  },

  getTimeRange: function(req, res, next) {
    //Time can be entered as any input accepted by Javascript's Date constructor specified by MDN: 
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    var timeStart = new Date(parseInt(req.query.timeStart)).getTime(),
        timeEnd = new Date(parseInt(req.query.timeEnd)).getTime(), 
        keyword = req.query.keyword;

    utils.getTweetsByTimeRange(keyword, timeStart, timeEnd, function(err, tweetArray) {
      if(err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(tweetArray);
      }
    });
  }
};
