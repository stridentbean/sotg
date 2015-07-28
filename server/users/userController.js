//imports
var User = require('./userModel.js'),
  jwt = require('jwt-simple'),
  db = require('../db/schema.js'),
  utils = require('../config/utils.js'), 
  uuid = require('uuid'),
  sessionUtils = require('../utils/session.js'),
  mailTransporter = require('../config/nodemailer.config.js').transporter,
  mailOptions = require('../config/nodemailer.config.js').options;

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
    
    new User().authenticate(user, req, res, function(err, response) {
      if (err) {
        res.status(404);
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
      new User().addUser({
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
      res.status(404);
      res.send({
        error: 'Username should be a valid email'
      });
    }
  },

  sendPasswordResetEmail: function(req, res, next) {
    console.log("Sending email to: ", req.body.username);
    var token = uuid.v4();
    new User({username: req.body.username})
    .set('resetPasswordToken', token)
    .save()
    .then(function(res) {
      console.log("Saved user with reset password token.");
    });
    mailOptions.html =
      '<a href="http://localhost:8000/users/password/reset?token=' + token +'">Reset Password</a>';
    mailTransporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        return console.log(err);
      } else {
        console.log('Message sent: ' + info.response);
        res.send(info.response);
      }
    });
  },

  resetPassword: function(req, res, next) {
    console.log("Resetting password with token: ", req.query.token);
    res.send("Resetting password with token: ", req.query.token);
  },

  updatePassword: function(req, res, next) {
    var user = req.body.user;
    var password = req.body.password;
    new User().updatePassword(user, password, function(err, result) {
      if (err) {
        // TODO: Fix status codes
        res.status(500).send("Could not update password: " + err);
      } else {
        res.status(200).send(result);
      }
    });
  },

  logout: function(req, res) {
    sessionUtils.destroySession(req, res);
  },

  keywords: function(req, res) {
    new User({id: req.query.userId})
    .keywords()
    .fetch()
    .then(function(keywords) {
      if (keywords.toJSON().length > 0) {
        res.send(keywords.toJSON());
      } else {
        res.status(200).send('Add some keywords');
      }
    });
  },

  getProfile: function(req, res) {
    var user = {
      username: req.session.user
    };
    new User().getProfile(user, function(err, result) {
      if (!err) {
        res.status(200);
        res.send({
          username: result.get('username'), 
          apiKey: result.get('apiKey'), 
          keywords: []
        });
      } else {
        res.status(404);
        res.send({
          error: err
        });
      }
    });
  }
};
