var User = require('../../../server/users/userModel.js'),
  StreamingServer = require('../../../server/api/streamingServerModel.js'),
  Keyword = require('../../../server/api/keywordModel.js'),  db = require('../../../server/config/db.js'),
  Q = require('q'),
  should = require('chai').should();

/**
 * Describes how a user should work
 * @class
 */

describe('User', function() {

  var keyword1 = 'cola', keyword2 = 'usa';
  var user;
  var user2;
  var PASS = 'password';
  var USER = 'user';
  //create the user then call the it functions
  before(function(next) {
    db.truncateAllTables(function() {
      new User({
          username: USER,
          password: PASS
        })
        .save()
        .then(function(model) {
          user = model;

          new User({
              username: 'user2',
              password: PASS
            })
            .save()
            .then(function(model2) {
              user2 = model2;

              new StreamingServer({
                  registered: true
                })
                .save()
                .then(function(streamingModel) {

                  new Keyword({
                      streamId: streamingModel.get('key'),
                      keyword: 'randomword'
                    })
                    .save()
                    .then(function(keywordModel) {

                      next();
                    });
                });
            });
        });
    });
  });

  it('should create a user', function() {
    should.exist(user);
    should.exist(user2);
  });

  it('should create an api key', function() {
    should.exist(user.get('apiKey'));
    user.get('apiKey').should.not.equal('');
  });

  it('should compare correct passwords', function(next) {
    user
      .comparePassword(PASS, function(isMatch) {
        isMatch.should.equal(true);
        next();
      });
  });

  it('should compare incorrect passwords', function(next) {
    user
      .comparePassword('notthepass', function(isMatch) {
        isMatch.should.equal(false);
        next();
      });
  });

  it('add a keyword', function(done) {
    user.addKeyword(keyword1, function(status) {
      status.code.should.equal(1);
      should.exist(status.keywordModel);
      user.getKeywords(function(keywords) {
        keywords.length.should.equal(1);
        keywords.models[0].get('streamId').should.be.a('string');
        done();
      });
    });
  });

  it('add a dublicate keyword', function(done) {
    user.addKeyword(keyword1, function(status) {
      status.code.should.equal(2);
      user.getKeywords(function(keywords) {
        keywords.length.should.equal(1);
        keywords.models[0].get('streamId').should.be.a('string');
        done();
      });
    });
  });

  it('add a keyword to a second user', function(done) {
    user2.addKeyword(keyword1, function() {
      user2.getKeywords(function(keywords) {
        keywords.length.should.equal(1);
        keywords.models[0].get('streamId').should.be.a('string');
        done();
      });
    });
  });

  it('add multiple keywords', function(done) {
    user.addKeyword(keyword2, function() {
      user.getKeywords(function(keywords) {
        keywords.length.should.equal(2);
        keywords.models[0].get('streamId').should.be.a('string');
        keywords.models[1].get('streamId').should.be.a('string');
        done();
      });
    });
  });

  it('get multiple keywords', function(done) {
    user.getKeywords(function(keywords) {
      keywords.length.should.equal(2);
      done();
    });
  });

  it('delete a keyword', function(done) {
    user.removeKeyword(keyword2, function(status) {
      status.code.should.equal(0);
      should.exist(status.keywordModel);

      user.getKeywords(function(keywords) {
        keywords.length.should.equal(1);
        done();
      });
    });
  });

  it('delete a keyword that exists for another usser', function(done) {
    user.removeKeyword(keyword1, function(status) {
      status.code.should.equal(1);

      user.getKeywords(function(keywords) {
        keywords.length.should.equal(0);
        done();
      });
    });
  });

  it('delete a keyword that does not exist', function(done) {
    user.removeKeyword('blarg', function(status) {
      status.code.should.equal(2);

      user.getKeywords(function(keywords) {
        keywords.length.should.equal(0);
        done();
      });
    });
  });

});
