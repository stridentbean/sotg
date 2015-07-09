var _ = require('underscore');

var generateApiKey = function() {
  //TODO make sure unique API KEY
  var apiKey = '';
  var storageUtil = require('./storage/StorageUtility.js');
  do {
    apiKey = randomString(40, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  } while (!storageUtil.isApiKeyUniqueue(apiKey));
};

var randomString = function(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return result;
};

var validateEmail = function(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
};

exports.generateApiKey = generateApiKey;
exports.randomString = randomString;
exports.validateEmail = validateEmail;