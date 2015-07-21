var User = require('../../../server/users/userModel.js'),
  db = require('../../../server/config/db.js'),
  request = require('request'),
  Q = require('q'),
  should = require('chai').should(),
  schema = require('../../../server/db/schema.js');
  process.env.PORT = PORT = 8001;

/**
 * Describes how a user account is created
 * @class
 */

describe('User Integration', function() {

  var server,
    port;

  before(function(done) {
    server = require('../../../server/server.js');
    setTimeout(function() {
      schema.truncateAllTables(done);
    }, 1000);
  });
  
  describe('Account Creation', function() {
    var PASS = 'password';
    var USER = 'user2@gmail.com';

    beforeEach(function(done) {
      schema.truncateAllTables(function() {
        done();
      });
    });

    it('Signup creates a user record', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://localhost:' + PORT + '/users/signup',
        'json': {
          'username': USER,
          'password': PASS,
        }
      };

      request(options, function(error, res, body) {
        new User({
            username: USER,
          })
          .fetch()
          .then(function(user) {
            user.get('username').should.equal(USER);
            should.exist(user.get('apiKey'));
            user.get('apiKey').should.be.a('string');
            done();
          });
      });
    });

    it('Signup should reject a bad username', function(done) {
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
        done();
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

    beforeEach(function(done) {
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
          done();
        });
      });
    });

    it('Signin to a user record', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://localhost:' + PORT + '/users/signin',
        'json': {
          'username': USER,
          'password': PASS,
        }
      };

      request(options, function(error, res, body) {
        console.log(res.body);
        res.statusCode.should.equal(201);
        //TODO: Make test more robust
        done();
      });
    });

    it('Signin should reject a bad username/password combo', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://localhost:' + PORT + '/users/signin',
        'json': {
          'username': 'userNotAnEmail',
          'password': PASS,
        }
      };

      request(options, function(error, res, body) {
        res.statusCode.should.equal(404);
        done();
      });
    });
  });

  describe("User API", function() {

    xit('/users/keywords should return list of keywords', function() {
      var options = {
        'method': 'GET',
        'uri': 'http://localhost:' + PORT + '/users/keywords'
      };
    });
  });
  
});

