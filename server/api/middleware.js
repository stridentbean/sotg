var User = require('../users/userModel.js'),
  StreamingServer = require('./streamingServerModel.js'),
  utils = require('../config/utils.js');

var authAPIKey = module.exports.authAPIKey = function(req, res, next) {
  var apiKey = req.query.apiKey,
    route = req.route.path;
  method = Object.keys(req.route.methods)[0]; //post, delete, get...

  if (!apiKey) {
    res.status(401).send('Must provide an API key for this endpoint.');
  } else {
    new User({
        apiKey: apiKey
      })
      .fetch()
      .then(function(user) {
        if (user) {

          var now = new Date();
          user.updateThrottle(now);
          user.save();

          req.query.userId = user.get('id');

          if (user.get('throttle') < 0) {
            res.status(429).send('Too many API calls, please back off');
          } else {
            next(); //go to next function to resolve API request
          }

          utils.insertApiTransaction(method, route, user, now); //save this until after the user request is resolved

        } else {
          res.status(401).send('Invalid API key');
        }
      });
  }
};

var authAdmin = module.exports.authAdmin = function(req, res, next) {
  var streamId = req.query.streamId,
    route = req.route.path;

  if (!streamId) {
    res.status(401).send('Must provide an Streaming Server key');
  } else {
    new StreamingServer({
        key: streamId
      })
      .fetch()
      .then(function(streamingServer) {
        if (streamingServer) {

          next(); //go to next function to resolve API request
          streamingServer.set('registered', true);
          streamingServer.save();

        } else {
          res.status(401).send('Invalid Streaming Server key');
        }
      });
  }
};
