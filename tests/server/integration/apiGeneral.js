process.env.PORT = PORT = 8001; // Set port env for test server;
process.env.NODE_ENV = 'test';

var request = require('request'),
  queue = require('../../../server/utils/queue.js'),
  should = require('chai').should(),
  PORT;

describe('API Endpoint Behavior', function() {
  require('../../../server/server'); // Spin up the server;
  before(function(done) {
    setTimeout(function() {
      done();
    }, 1000);
  });

  after(function(done) {
    done();
  });
  it('should return "success" on /addKeyword endpoint', function(next) {
    var addKeywordOptions = {
      'method': 'POST',
      'uri': 'http://localhost:' + PORT + '/api/addKeyword',
      'json': {
        'keyword': 'pizza'
      }
    };
    request(addKeywordOptions, function(error, res, body) {
      res.statusCode.should.equal(200);
      next();
    });
  });
  it('should return keywords on /getKeywords endpoint', function(next) {
    var getKeywordsOptions = {
      'method': 'GET',
      'uri': 'http://localhost:' + PORT + '/api/getKeywords',
      'json': {
        'streamId': 1
      }
    };
      request(getKeywordsOptions, function(error, res, body) {
        console.log(body);
        next();
      });
  });
});
