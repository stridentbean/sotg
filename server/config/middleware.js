var morgan = require('morgan'); // used for logging incoming request
var helpers = require('./helpers.js');
var bodyParser = require('body-parser');

module.exports = function(app, express) {
  //routes
  var userRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));

  app.use('/api/users', userRouter); //TODO Decide wither we should use APU/...
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their respective route files
  require('../users/userRoutes.js')(userRouter);
};