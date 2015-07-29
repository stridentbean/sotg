var User = require('../../../server/users/userModel.js'),
  db = require('../../../server/config/db.js'),
  Q = require('q'),
  should = require('chai').should();

/**
 * Describes how a user should work
 * @class
 */

describe.only('User', function() {

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

              next();
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
    user.addKeyword(keyword1, function() {
      user.getKeywords(function(keywords) {
        keywords.length.should.equal(1);
        keywords[0].get('streamId').should.be.a('string');
        done();
      });
    });
  });

  it('add a keyword to a second user', function(done) {
    user2.addKeyword(keyword1, function() {
      user2.getKeywords(function(keywords) {
        keywords.length.should.equal(1);
        keywords[0].get('streamId').should.be.a('string');
        done();
      });
    });
  });

  it('add multiple keywords', function(done) {
    user.addKeyword(keyword2, function() {
      user.getKeywords(function(keywords) {
        keywords.length.should.equal(2);
        keywords[0].get('streamId').should.be.a('string');
        keywords[1].get('streamId').should.be.a('string');
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
    user.removeKeyword(keyword2, function(res) {
      res.status.should.equal(0);

      user.getKeywords(function(keywords) {
        keywords.length.should.equal(1);
        done();
      });
    });
  });

  it('delete all keywords', function(done) {
    user.removeKeyword(keyword1, function(res) {
      res.status.should.equal(1);

      user.getKeywords(function(keywords) {
        keywords.length.should.equal(0);
        done();
      });
    });
  });

  it('delete a keyword that does not exist', function(done) {
    user.removeKeyword('blarg', function(res) {
      res.status.should.equal(2);

      user.getKeywords(function(keywords) {
        keywords.length.should.equal(0);
        done();
      });
    });
  });

});
