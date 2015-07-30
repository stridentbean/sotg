var express = require('express');

var app = express(),
  server, 
  PORT = process.env.STREAMING_PORT || 5001;  //default port

var keywords = {};
require('./config/middleware.js')(app, express, keywords);
server = require('./theStreamer.js');
server.set(keywords, PORT);
server.start();

module.exports = function(port) {
  console.log('port', (port||PORT));
  var server = app.listen(port || PORT); 
  return server;
};

module.exports();
