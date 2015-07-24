var SECRET = 'SECRET';
var db = require('../db/schema'),
  bcrypt = require('bcrypt-nodejs'),
  Promise = require('bluebird'),
  jwt = require('jwt-simple'),
  Keyword = require('../api/keywordModel.js'),
  sessionUtils = require('../utils/session.js'),
  uuid = require('uuid'),
  KeywordUser = require('../api/keywordUserModel.js'),
  API_CALLS_PER_MINUTE = 100.0;

/**
 * Creates a new User
 * @class
 */

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  defaults: {
    throttle: API_CALLS_PER_MINUTE,   //100 api uses per minute
    lastApiCall: new Date() //leave as default first API call
  },

  /** 
   * Initializes the user with salt and apikey 
   *@function
   */
  initialize: function() {
    this.on('creating', this.hashPassword);
    this.on('creating', this.generateApiKey);
  },

  keywords: function() {
    // We have to require here to prevent circular requires
    return this.belongsToMany(require('../api/keywordModel.js'));
  },

  /**
   * Generates an API Key
   *@function
   */

  generateApiKey: function() {
    this.set("apiKey", uuid.v4());
  },

  /**
   * Hashes and Salts the password
   *@function
   */
  hashPassword: function() {
    var cipher = Promise.promisify(bcrypt.hash);
    // return a promise - bookshelf will wait for the promise
    // to resolve before completing the create action
    return cipher(this.get('password'), null, null)
      .bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  },

  addUser: function(user, req, res, callback) {
    new User({username: user.username})
    .fetch()
    .then(function(foundUser) {
      if (foundUser) {
        callback({
          error: 'User already exists!'
        });
      } else {
        // make a new user if not one
        new User(user)
        .save()
        .then(function(newUser) {
          sessionUtils.createSession(req, res, newUser.get('username'));
        });
      }
    });
  },

  authenticate: function(user, req, res, callback) {
    new User({username: user.username})
    .fetch()
    .then(function(foundUser) {
      if (!foundUser) {
        callback({
          error: 'User does not exist'
        });
      } else {
        bcrypt.compare(user.password, foundUser.get('password'), function(err, isMatch) {
          if (err) {
            console.log("Error comparing passwords.");
            callback({
              error: 'Error comparing passwords.'
            });
          } else {
            if (isMatch) {
              sessionUtils.createSession(req, res, foundUser.get('username'));
            } else {
              callback({
                error: 'The password you entered does not match our records.'
              });
            }
          }
        });
      }
    });
  },
  /** 
   * Compares a password with the password stored in the database
   *@function
   *@arg candidatePassword {string} The password to compare against what is stored 
   *in the datebase
   */

  comparePassword: function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  },

  // TODO: Password is being re-hashed every time
  // any property on user is updated and saved.
  // This is because of the this.on('updating') in
  // the initialize function.
  setPassword: function(user, password, callback) {
    console.log(user);
    console.log(password);
    var cipher = Promise.promisify(bcrypt.hash);
    // return a promise - bookshelf will wait for the promise
    // to resolve before completing the create action
    cipher(password, null, null)
    .then(function(hash) {
      new User({username: user})
      .fetch()
      .then(function (model) {
        console.log("Model: ", model);
        console.log("Hash: ", hash);
        model.save({
          password: hash
        }, {
          method: 'update'
        }).then(function(model) {
          callback(null, "New password set for user: " + model.get('username'));
        });
      });
    });
  },

  getProfile: function(user, callback) {
    new User(user)
    .fetch()
    .then(function(user) {
      if(user) {
        callback(null, user);
      } else {
        callback(new Error('Cannot find user!'));
      }
    });
  },

  /**
  * Updates a users throttle 
  *@function
  *@arg newApiCall {Date} The date/time of the new api call
  */

  updateThrottle: function(newApiCall) {
    var lastApiCall = this.get('lastApiCall');

    var timeSinceLastCallInSeconds = (newApiCall - lastApiCall) / 1000;

    //throttleToAdd = the per second refil rate * number of seconds since last call - current api call
    throttleToAdd = (API_CALLS_PER_MINUTE / 60) * timeSinceLastCallInSeconds - 1;
    
    if (throttleToAdd + this.get('throttle') > API_CALLS_PER_MINUTE) {
      this.set('throttle', API_CALLS_PER_MINUTE);
    } else {
      this.set('throttle', this.get('throttle') - 1 + throttleToAdd);
    }

    this.set('lastApiCall', newApiCall);

  }

});

module.exports = User;
