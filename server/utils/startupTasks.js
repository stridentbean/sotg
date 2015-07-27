var StreamingServers = require('../api/streamingServerModel.js'),
  DESIRED_NUMBER_OF_STREAMING_SERVERS = 4;

//allow time for the database to create tables
setTimeout(function() {
  new StreamingServers()
    .fetchAll()
    .then(function(models) {

      if (models.length < DESIRED_NUMBER_OF_STREAMING_SERVERS) {
        for (var i = models.length; i < DESIRED_NUMBER_OF_STREAMING_SERVERS; i++) {
          new StreamingServers()
            .save();
        }
      }
    });

}, 250);

//check to see if streaming servers stop pooling, if so unregister them
setInterval(function() {

  // var StreamingServers = require('../api/streamingServerModel.js');
  new StreamingServers()
    .query(function(qb) {
      qb.where('registered', '=', true)
        .andWhere('updated_at', '<', new Date(new Date() - 15 * 60 * 1000));
    })
    .fetchAll()
    .then(function(streamingServers) {
      // console.log('fetched', streamingServers.length);
      streamingServers.forEach(function(server) {
        server.set('registered', false);
        server.save();
        // console.log('unregister', server);
      });
    });
}, 15 * 60 * 1000); //every 15 minutes

module.exports = {};
