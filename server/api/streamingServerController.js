var db = require('../db/schema.js'),
  StreamingServer = require('./streamingServerModel.js');

module.exports = {

  getAvailableKey: function(req, res, next) {

    new StreamingServer()
      .query('where', 'registered', '=', false)
      .fetchAll()
      .then(function(collection) {

        if (collection.length > 0) {
          res.status(200).send(collection.models[0].get('key'));
          collection.models[0].set('registered', true);
          collection.models[0].save();
        } else {
          res.status(400).send('no keys available at this time');
        }
      });

  }

};
