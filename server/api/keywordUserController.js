var KeywordUserModel = require('./keywordUserModel.js');
var KeywordModel = require('./keywordModel.js');

module.exports = {
  getKeywords: function(req, res, next) {
    console.log("Getting keywords for user ", req.query.userId);
    new KeywordUserModel({})
    .where({user_id: req.query.userId})
    .fetchAll()
    .then(function(keyword) {
      if (keyword) {
        var keyword_id = keyword.get('id');
        new KeywordUserModel().getKeywords(keyword_id, req.query.userId, function(results) {
          res.send(results);
        });
      }
    });
  }
};
