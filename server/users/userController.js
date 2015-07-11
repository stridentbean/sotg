//imports
var User = require('./userModel.js'),
  jwt = require('jwt-simple'),
  db = require('../db/schema.js'),
  utils = require('../config/utils.js');

//globals
//TODO get a better phrase
var SECRET = 'superDupperSecret';

/**
 * A module that controllers user activities
 * @module users/userController
 */

module.exports = {

  /** 
   * signin 
   */

  signin: function(req, res, next) {
    var username = req.body.username,
      password = req.body.password;
    console.log('signin username: ' + username);
    console.log('signin password: ' + password);
    new User({
        username: username
      })
      .fetch()
      .then(function(user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          return user.comparePassword(password, function(foundUser) {
            if (foundUser) {
              var token = jwt.encode(user, SECRET);
              res.json({
                token: token
              });
            } else {
              return next(new Error('Bad User/Password combonation'));
            }
          });
        }
      });

  },

  /** signup */

  signup: function(req, res, next) {
    var username = req.body.username,
      password = req.body.password;
      console.log('signup username: ' + username);
      console.log('signup password: ' + password);

    if (utils.validateEmail(username)) {
      // check to see if user already exists
      new User({
          username: username
        })
        .fetch()
        .then(function(user) {
          if (user) {
            next(new Error('User already exist!'));
          } else {
            // make a new user if not one
            new User({
              username: username,
              password: password
            }).save().then(function(newUser) {
              // create token to send back for auth
              var token = jwt.encode(user, SECRET);
              res.json({
                token: token
              });

              return newUser;
            });
          }
        });
    } else {
      return next(new Error('Username should be a valid email'));
    }
  },

  /** checkAuth */

  checkAuth: function(req, res, next) {
    console.log('checking auth');
  }
};
