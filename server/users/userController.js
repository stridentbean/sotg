var User = require('./userModel.js');

module.exports = {
  signin: function(req, res, next) {
    var username = req.body.username,
      password = req.body.password;

  },

  signup: function(req, res, next) {
    var username = req.body.username,
      password = req.body.password;
  },

  checkAuth: function(req, res, next) {

  }
};