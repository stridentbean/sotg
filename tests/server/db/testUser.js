var User = require('../../../server/users/userModel.js');
var db = require('../../../server/db/schema.js');
var should = require('chai').should();

describe('User', function() {

  var user;

  //create the user then call the it functions
  beforeEach(function(done) {
    db.truncateAllTables(function() {
      new User({
          username: 'user',
          password: 'password',
          email: 'test@gmail.com'
        })
        .save()
        .then(function(model) {
          user = model;
          done();
        });
    });
  });

  it('should create a user', function() {
    should.exist(user);
  });

  it('should salt a password', function() {
    should.exist(user.get('salt'));
  });

  it('should create an api key', function() {
    should.exist(user.get('apiKey'));
  });

});