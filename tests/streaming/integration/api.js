// process.env.STREAMING_PORT = 
var PORT = 5001; // Set port for streaming test server
process.env.NODE_TEST_ENV = 'test';

var request = require('request'),
  should = require('chai').should(),
  schema = require('../../../server/db/schema.js');

/**
 * Describes how a user account is created
 * @class
 */

describe('Streaming Server Integration', function() {

  var server,
    key = '',
    port;

  before(function(done) {
    var load = require('../../../server/utils/startupTasks.js');

    require('../../../streaming/server.js'); // Spin up the server
    setTimeout(function() {
      schema.truncateAllTables(done);
    }, 250);
  });

  describe("Streaming API", function() {

    it('should be able to ping the server', function(done) {
      var options = {
        'method': 'GET',
        'uri': 'http://localhost:' + PORT + '/api/ping'
      };
      request(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        should.exist(res.body);
        done();
      });
    });

    it('should fail on an empty keyword', function(done) {
      var keyword = '';
      var options = {
        'method': 'POST',
        'uri': 'http://localhost:' + PORT + '/api/keywords?key=' + key + '&keyword=' + keyword
      };
      request(options, function(err, res, body) {
        res.statusCode.should.equal(400);
        res.body.should.be.a('string');
        done();
      });
    });

    it('should be able to send a keyword', function(done) {
      var keyword = 'cola';
      var options = {
        'method': 'POST',
        'uri': 'http://localhost:' + PORT + '/api/keywords?keyword=' + keyword
      };
      request(options, function(err, res, body) {
        res.statusCode.should.equal(201);
        res.body.should.be.a('string');
        done();
      });
    });

    it('should be able to send a keyword duplicate', function(done) {
      var keyword = 'cola';
      var options = {
        'method': 'POST',
        'uri': 'http://localhost:' + PORT + '/api/keywords?keyword=' + keyword
      };
      request(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        res.body.should.be.a('string');
        done();
      });
    });

    it('should be able to delete a keyword', function(done) {
      var keyword = 'cola';
      var options = {
        'method': 'DELETE',
        'uri': 'http://localhost:' + PORT + '/api/keywords?keyword=' + keyword
      };
      request(options, function(err, res, body) {
        res.statusCode.should.equal(204);
        res.body.should.be.a('string');
        done();
      });
    });

    it('should not be able to delete an empty keyword', function(done) {
      var keyword = '';
      var options = {
        'method': 'DELETE',
        'uri': 'http://localhost:' + PORT + '/api/keywords?keyword=' + keyword
      };
      request(options, function(err, res, body) {
        res.statusCode.should.equal(400);
        res.body.should.be.a('string');
        done();
      });
    });

    it('should not be able to delete a keyword that does not exist', function(done) {
      var keyword = 'chinchilla';
      var options = {
        'method': 'DELETE',
        'uri': 'http://localhost:' + PORT + '/api/keywords?keyword=' + keyword
      };
      request(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        res.body.should.be.a('string');
        done();
      });
    });
  });



});
