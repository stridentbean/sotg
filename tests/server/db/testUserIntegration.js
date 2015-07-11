var User = require('../../../server/users/userModel.js'),
  db = require('../../../server/db/schema.js'),
  request = require('request'),
  Q = require('q'),
  should = require('chai').should(),
  PORT = process.env.MYSQL_DATABASE_USER || 8000;

/**
 * Describes how a user account is created
 * @class
 */

describe('Account Creation', function() {
  var PASS = 'password';
  var USER = 'user2@gmail.com';

  beforeEach(function(next) {
    db.truncateAllTables(function() {
      next();
    });
  });

  it('Signup creates a user record', function(next) {
    var options = {
      'method': 'POST',
      'uri': 'http://localhost:8000/users/signup',
      'json': {
        'username': USER,
        'password': PASS,
      }
    };

    request(options, function(error, res, body) {
      new User({
          username: USER
        })
        .fetch()
        .then(function(user) {
          user.get('username').should.equal(USER);
          should.exist(user.get('apiKey'));
          user.get('apiKey').should.be.a('string');
          next();
        });
    });
  });

  it('Signup should reject a bad username', function(next) {
    var options = {
      'method': 'POST',
      'uri': 'http://localhost:' + PORT + '/users/signup',
      'json': {
        'username': 'userNotAnEmail',
        'password': PASS,
      }
    };

    request(options, function(error, res, body) {
      should.exist(res.body.error);
      next();
    });
  });
});

/**
 * Describes how a user account is signed into
 * @class
 */

describe('Account Signin', function() {
  var PASS = 'password';
  var USER = 'user2@gmail.com';

  beforeEach(function(next) {
    db.truncateAllTables(function() {
      var options = {
        'method': 'POST',
        'uri': 'http://localhost:' + PORT + '/users/signup',
        'json': {
          'username': USER,
          'password': PASS,
        }
      };

      request(options, function(error, res, body) {
        next();
      });
    });
  });

  it('Signin to a user record', function(next) {
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:' + PORT + '/users/signin',
      'json': {
        'username': USER,
        'password': PASS,
      }
    };

    request(options, function(error, res, body) {
      should.exist(res.body.token);
      res.body.token.should.be.a('string');
      next();
    });
  });

  it('Signin should reject a bad username/password combo', function(next) {
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:' + PORT + '/users/signin',
      'json': {
        'username': 'userNotAnEmail',
        'password': PASS,
      }
    };

    request(options, function(error, res, body) {
      should.exist(res.body.error);
      next();
    });
  });
});
