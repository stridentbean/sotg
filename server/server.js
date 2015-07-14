var express = require('express');

var app = express(),
  server, 
  PORT = 8000;

require('./config/middleware.js')(app, express);

module.exports = {
  start: function() {
    server = app.listen(PORT);
    console.log('Server is listening on ' + PORT);
  },

  stop: function() {
    server.close();
  }
};