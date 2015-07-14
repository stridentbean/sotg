var express = require('express');

var app = express(),
  server, 
  PORT = 8000;

require('./config/middleware.js')(app, express);

module.exports = server = app.listen(PORT); 
