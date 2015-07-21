var KeywordUserModel = require('./keywordUserModel.js');
var KeywordModel = require('./keywordModel.js');

module.exports = {
  getKeywords: function(req, res, next) {
    console.log("Getting keyword ", req.body.keyword,
      " for user ", req.body.userId);
    new KeywordModel({keyword: req.body.keyword})
    .fetch()
    .then(function(keyword) {
      if (keyword) {
        var keyword_id = keyword.get('id');
        new KeywordUserModel().getKeywords(keyword_id, req.body.userId, function(results) {
          res.send(results);
        });
      }
    });
  }
};
