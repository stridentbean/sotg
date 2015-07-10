var db = require('../db/schema'),
  utils = require('../config/utils.js'),
  bcrypt = require('bcrypt-nodejs'),
  Q = require('q'),
  SALT_WORK_FACTOR = 10;
/**
 * Creates a new User
 * @class
 */

var User = db.Model.extend({
  tableName: 'User',
  hasTimestamps: true,
  defaults: {
    email: ''
  },

  /** 
   * Initializes the user with salt and apikey 
   *@function
   */
  initialize: function() {
    var user = this;

    //TODO this does not gaurentee uniqueness 
    this.set("apiKey", utils.generateApiKey());

    //TODO
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) {
        //handle err
        console.log(err);
      }

      // hash the password along with our new salt
      bcrypt.hash(user.get('password'), salt, null, function(err, hash) {
        if (err) {
          //handle err
          console.log(err);
        }

        // override the cleartext password with the hashed one
        user.set('password', hash);
        user.set('salt', salt);
      });
    });
  },

  /** 
   * Compares a password with the password stored in the database
   *@function
   *@arg candidatePassword {string} The password to compare against what is stored 
   *in the datebase
   */

  comparePassword: function(candidatePassword, callback) {
    var savedPassword = this.get('password');
    bcrypt.compare(candidatePassword, savedPassword, function(err, isMatch) {
      if (err) {
        console.log(err);
        callback(false);
      } else {
        if (isMatch) {
          callback(true);
        } else {
          callback(false);
        }
      }
    });
  }
});

module.exports = User;