var _ = require('underscore');
var keywords = {};
module.exports = {
  addKeyword: function(req, res, next) {
    var keyword = req.query.keyword;
    
    if (keyword) {
      if (keywords.hasOwnProperty(keyword)) {
        res.status(200).send('keyword is already added');
      } else {
        keywords[keyword] = true; //add to hash table
        res.status(201).send('keyword added');
      }
    } else {
      res.status(400).send('invalid keyword');
    }
    console.log(keywords, keyword);
  },

  deleteKeyword: function(req, res, next) {
    var keyword = req.query.keyword;

    if (keyword) {
      if (keywords.hasOwnProperty(keyword)) {
        delete keywords[keyword];
        res.status(204).send('keyword removed');
      } else {
        res.status(200).send('keyword does not exist');
      }
    } else {
      res.status(400).send('invalid keyword');
    }
    console.log(keywords, keyword);
  },

  ping: function(req, res, next) {
    res.status(200).send('ping');
  },

  setKeywords: function(sharedKeywords) {
    keywords = sharedKeywords;
  }

};
