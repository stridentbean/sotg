var express = require('express');

var app = express(), 
    PORT = 8000;

require('./config/middleware.js')(app, express);
console.log('Server is listening on ' + PORT);
app.listen(PORT);