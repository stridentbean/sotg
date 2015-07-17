var Utils = require('../../../server/config/utils.js'),
  db = require('../../../server/config/db.js'),
  should = require('chai').should();

/**
 * Describes how Utils should work
 * @class
 */

describe('Utils', function() {

  describe('validateEmail', function() {

    it('should validate correct emails', function() {
      Utils.validateEmail('blarg@gmail.com').should.equal(true);
    });

    it('should invalidate correct emails', function() {
      Utils.validateEmail('blarggmailcom').should.equal(false);
      Utils.validateEmail('blarg@gmailcom').should.equal(false);
      Utils.validateEmail('blarggmail.com').should.equal(false);
      Utils.validateEmail('blarg;gmail.com').should.equal(false);
    });

  });

  describe('insertApiTransaction', function() {

  });

});
