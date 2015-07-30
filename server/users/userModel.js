var SECRET = 'SECRET';
var db = require('../db/schema'),
  bcrypt = require('bcrypt-nodejs'),
  Promise = require('bluebird'),
  jwt = require('jwt-simple'),
  Keyword = require('../api/keywordModel.js'),
  KeywordUser = require('../api/keywordUserModel.js'),
  utils = require('../config/utils.js'),
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
    throttle: API_CALLS_PER_MINUTE, //100 api uses per minute
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

  addKeyword: function(keyword, callback) {

    var user = this;
    new Keyword({
        keyword: keyword
      })
      .fetch()
      .then(function(keywordModel) {

        if (keywordModel) { //if this is keyword exists already

          new KeywordUser({
              keyword_id: keywordModel.get('id'),
              user_id: user.get('id')
            })
            .save()
            .then(function(keywordUserModel) {
              callback({
                code: 0,
                message: 'keyword user created'
              });
            })
            .catch(function(err) { //catch duplicate error
              callback({
                code: 2,
                message: 'keyword exists'
              });
            });

        } else { //if this keyword is new
          user.keywords()
            .fetch()
            .then(function(keywordCollection) {

              utils.getLeastUsedStream(function(stream) {

                //allow the user to add keywords even if no stream is available
                var streamId = null;
                if (stream) {
                  streamId = stream.key;
                }

                new Keyword({
                    keyword: keyword,
                    streamId: streamId
                  })
                  .save()
                  .then(function(newKeywordModel) {

                    keywordCollection.attach(newKeywordModel)
                      .then(function(newCollection) {
                        callback({
                          code: 1,
                          message: 'keyword created',
                          keywordModel: newKeywordModel
                        });
                      });
                  });
              });
            });
        }

      });

  },

  getKeywords: function(done) {

    this.keywords()
      .fetch()
      .then(function(keywordCollection) {
        done(keywordCollection);
      });
  },

  removeKeyword: function(keyword, done) {

    var user = this;

    //get the keyword object
    new Keyword({
        keyword: keyword
      })
      .fetch()
      .then(function(keywordModel) {

        if (keywordModel) {

          //delete this keyword reference
          new KeywordUser()
            .query({
              where: {
                keyword_id: keywordModel.get('id'),
                user_id: user.get('id')
              }
            })
            .destroy()
            .then(function() {
              //check to see if other references exist for this keyword
              new KeywordUser()
                .query({
                  where: {
                    keyword_id: keywordModel.get('id')
                  }
                })
                .fetchAll()
                .then(function(keywordUserCollection) {

                  if (keywordUserCollection.length === 0) {
                    //delete the entire keyword
                    var copy = new Keyword({
                      keyword: keywordModel.get('keyword'),
                      streamId: keywordModel.get('streamId')
                    });
                    keywordModel
                      .destroy()
                      .then(function() {
                        done({
                          code: 0,
                          message: 'keyword deleted',
                          keywordModel: copy
                        });
                      });

                  } else {
                    done({
                      code: 1,
                      message: 'keyword user relation deleted'
                    });
                  }

                });

            });
        } else {
          done({
            code: 2,
            message: 'unknown keyword'
          });
        }
      });
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
    new User({
        username: user.username
      })
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
    new User({
        username: user.username
      })
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
  updatePassword: function(user, password, callback) {
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
        if (user) {
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
