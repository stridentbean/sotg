var db = require('../db/schema'),
  request = require('request'),
  KeywordUser = require('./keywordUserModel.js');

var addKeywordUser = function(apiKey, keyword, callback) {
  new User({
      apiKey: apiKey
    })
    .fetch()
    .then(function(user) {
      new KeywordUser({
        keyword_id: keyword.get('id'),
        user_id: user.get('id')
      }).upsert(callback);
    });
};

var Keyword = db.Model.extend({
  tableName: 'keywords',
  hasTimestamps: true,
  defaults: {},
  inititialize: function() {

  },
  users: function() {
    // We have to require here to prevent circular requires.
    return this.belongsToMany(require('../users/userModel'));
  },

  upsert: function(success) {
    
    //leastUsedStream

    new Keyword({
        keyword: this.get('keyword')
      })
      .fetch()
      .then(function(keywordModel) {
        if (keywordModel) {
          addKeywordUser(apiKey, keywordModel, success);
        } else {

          new Keyword({
            keyword: keyword,
            streamId: leastUsedStream
          })
          .save()
          .then(function(keywordModel) {
            addKeywordUser(apiKey, keywordModel, success);

            // new StreamingServer({
            //   key: keywordModel.get('streamId')
            //   })
            //   .fetch()
            //   .then(function(model) {
            //     console.log(model);
            //     model.sendToStreamingServer(keywordModel, function(isSuccessful){

            //     });
            //   });
          });
        }
      });
  },

  //runs the callback funtion if this keyword has one user listening
  // hasZeroUser: function(pass, fail) {
  //   new KeywordUser({})
  //     .where({
  //       keyword_id: this.get('id')
  //     })
  //     .fetchAll()
  //     .then(function(models) {
  //       if (models.length === 0) {
  //         pass();
  //       } else {
  //         fail();
  //       }
  //     });
  // }
});

module.exports = Keyword;
