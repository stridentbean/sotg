var KeywordUserModel = require('./keywordUserModel.js');
var KeywordModel = require('./keywordModel.js');

module.exports = {
  getKeywords: function(req, res, next) {
    console.log("Getting keywords for user ", req.body.userId);
    new KeywordUserModel({})
    .where({user_id: req.body.userId})
    .fetchAll()
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
