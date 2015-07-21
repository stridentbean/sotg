//imports
var User = require('./userModel.js'),
  jwt = require('jwt-simple'),
  db = require('../db/schema.js'),
  utils = require('../config/utils.js'), 
  sessionUtils = require('../utils/session.js');

// Create an empty Bookshelf User model to interact with the database.
User = new User();

//globals
//TODO get a better phrase
var SECRET = 'superDupperSecret';

/**
 * A module that controls user activities
 * @module users/userController
 */

module.exports = {

  /** 
   * signin 
   */

  signin: function(req, res, next) {
    var user = {
      username: req.body.username, 
      password: req.body.password 
    };
    
    User.authenticate(user, req, res, function(err, response) {
      if (err) {
        res.status(400);
        res.send(err);
      } else {
        res.status(201); 
        res.end();
      }
    });
  },

  /** signup */

  signup: function(req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    // Validate inside the controller
    if (utils.validateEmail(username)) {
      // Interact with the database inside the model
      User.addUser({
        username: username,
        password: password
      }, req, res, function(err, response) {
        if (err) {
          res.status(400);
          res.send(err);
        } else {
          // The model is currently returning a token. TODO: Handle it.
          res.status(201);
          res.end();
        }
      });
    } else {
      return next(new Error('Username should be a valid email'));
    }
  },

  getProfile: function(req, res) {
    var user = {
      username: req.session.user
    };
    User.getProfile(user, req, res);
  }
};
