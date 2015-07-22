var User = require('../users/userModel.js'),
  utils = require('../config/utils.js');

var authAPIKey = module.exports.authAPIKey = function(req, res, next) {
  var apiKey = req.query.apiKey,
    route = req.route.path;
  method = Object.keys(req.route.methods)[0]; //post, delete, get...

  if (!apiKey) {
    res.status(404).send('Must provide an API key for this endpoint.');
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
            res.status(404).send('Too many API calls, please back off');
          } else {
            next(); //go to next function to resolve API request
          }


          utils.insertApiTransaction(method, route, user, now); //save this until after the user request is resolved

        } else {
          res.status(404).send('Invalid API key!');
        }
      });
  }
};
