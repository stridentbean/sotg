process.env.PORT = PORT = 8001; // Set port for test server
process.env.NODE_ENV = process.env.NODE_ENV ||  'test';

var User = require('../../../server/users/userModel.js'),
  db = require('../../../server/config/db.js'),
  request = require('request'),
  Q = require('q'),
  should = require('chai').should(),
  schema = require('../../../server/db/schema.js');

/**
 * Describes how a user account is created
 * @class
 */

describe('User Integration', function() {

  var server,
    apiKey,
    port;

  before(function(done) {
    require('../../../server/server.js'); // Spin up the server
    setTimeout(function() {
      schema.truncateAllTables(done);
    }, 250);
  });
  
  describe('Account Creation', function() {
    var PASS = 'password';
    var USER = 'user2@gmail.com';

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
            // Set apiKey for future tests.
            apiKey = user.get('apiKey');
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

    it('should be able to add keyword', function(done) {
      var keyword = 'cola';
      new User({})
      .fetch()
      .then(function(user) {
        var options = {
          'method': 'POST',
          'uri': 'http://localhost:' + PORT + '/api/keywords?apiKey=' + apiKey
            + '&keyword=' + keyword
        }
        request(options, function(err, res, body) {
          res.body.should.be.a('string');
          done();
        });
      });
    });

    it('/users/keywords should return list of keywords', function(done) {
      var keyword = 'cola';
      new User({})
      .fetch()
      .then(function(user) {
        var options = {
          'method': 'GET',
          'uri': 'http://localhost:' + PORT + '/users/keywords?apiKey=' + apiKey + '&keyword=' + keyword
        };

        request(options, function(err, res, body) {
          body.should.be.a('string');
          res.statusCode.should.equal(200);
          done();
        });
      });
    });
  });
  
});

