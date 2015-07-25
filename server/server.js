var express = require('express');

var app = express();
var PORT = process.env.PORT || 8000;  //default port

require('./config/middleware.js')(app, express);
require('./utils/startupTasks.js');

var server = app.listen(PORT);

module.exports = server;
