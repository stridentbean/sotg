var apiController = require('./apiController.js'),
  keywordController = require('./keywordController.js'),
  streamingServerController = require('./streamingServerController.js'),
  middleware = require('./middleware.js');

module.exports = function(app) {
  app.get('/search', middleware.authAPIKey, apiController.getSearch);
  app.get('/sentiment', middleware.authAPIKey, apiController.getSentiment);
  app.get('/time', middleware.authAPIKey, apiController.getTimeRange);
  app.post('/keywords', middleware.authAPIKey, keywordController.addKeyword);
  app.get('/keywords', middleware.authAdmin, keywordController.getKeywords);
  app.delete('/keywords', middleware.authAPIKey, keywordController.deleteKeyword);
  app.get('/streamingKey', streamingServerController.getAvailableKey);
};
