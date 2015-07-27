var morgan = require('morgan'); // used for logging incoming request
var helpers = require('./helpers.js');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');

module.exports = function(app, express, keywords) {
  //routes
  var apiRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  
  app.use('/api', apiRouter);
  
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their respective route files
  require('../api/apiRoutes.js')(apiRouter, keywords);
};
