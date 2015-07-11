var morgan = require('morgan'); // used for logging incoming request
var helpers = require('./helpers.js');
var bodyParser = require('body-parser');
var path = require('path');

module.exports = function(app, express) {
  //routes
  var userRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));

  app.use('/users', userRouter); 
 
  app.all('/*', function(req, res, next) {
      res.sendFile(path.resolve('client/index.html'));
  });
  
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their respective route files
  require('../users/userRoutes.js')(userRouter);
};
