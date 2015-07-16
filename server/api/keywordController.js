var Keyword = require('./keywordModel.js'),
  db = require('../db/schema.js');

var getLeastUsedStream = function() {
  return 1;
};

module.exports = {
  
  addKeyword: function(req, res, next) {
    var keyword = req.body.keyword,
      leastUsedStream = getLeastUsedStream();
    console.log(keyword);
    new Keyword({
      keyword: keyword
    })
    .fetch()
    .then(function(exists) {
      if (exists) {
        return next({
          result: 'update',
          value: exists.get('keyword')
        });
      } else {
        new Keyword({
          keyword: keyword,
          streamId: leastUsedStream
        })
        .save()
        .then(function(keyword) {
          return next({
            result: 'insert',
            value: keyword.get('keyword')
          });
        });
      }
    });
  },

  getKeywords: function(req, res, next) {
    var streamId = req.body.streamId;
    var resultArray;
    new Keyword({streamId: streamId}).fetchAll()
    .then(function(results) {
      resultArray = results.map(function(el) {
        return el.get('keyword');
      });
      res.json(resultArray)
    });
  }
};
