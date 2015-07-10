var User = require('./userModel.js');

/**
 * A module that controllers user activities
 * @module users/userController
 */

module.exports = {

  /** signin */

  signin: function(req, res, next) {
    var username = req.body.username,
      password = req.body.password;

  },

  /** signup */

  signup: function(req, res, next) {
    var username = req.body.username,
      password = req.body.password;
  },

  /** checkAuth */
  
  checkAuth: function(req, res, next) {

  }
};