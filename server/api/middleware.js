var User = require('../users/userModel.js'),
  utils = require('../config/utils.js');

var authAPIKey = module.exports.authAPIKey = function(req, res, next) {
  var apiKey = req.query.apiKey,
    route = req.route.path;
    requestMethod = Object.keys(req.route.methods)[0];    //post, delete, get...

  if (!apiKey) {
    res.status(404).send('Must provide an API key for this endpoint.');
  }

  new User({
      apiKey: apiKey
    })
    .fetch()
    .then(function(user) {
      if (user) {
        console.log("User is authenticated");
        req.query.userId = user.get('id');
        next(); //go to next function to resolve API request
        utils.insertApiTransaction(requestMethod, route, user); //record apir usage
      } else {
        res.status(404).send('Invalid API key!');
      }
    });
};
