var db = require('../db/schema'),
  KeywordUser = require('./keywordUserModel.js');

var Keyword = db.Model.extend({
  tableName: 'Keywords',
  hasTimestamps: true,
  defaults: {},
  inititialize: function() {

  },
  users: function() {
    return this.belongsToMany(require('../users/userModel'));
  },

  //runs the callback funtion if this keyword has one user listening
  hasZeroUser: function(pass, fail) {
    new KeywordUser({})
      .where({
        keyword_id: this.get('id')
      })
      .fetchAll()
      .then(function(models) {
        if (models.length === 0) {
          pass();
        } else {
          fail();
        }
      });
  }
});

module.exports = Keyword;
