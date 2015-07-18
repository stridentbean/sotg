var apiController = require('./apiController.js');
var keywordController = require('./keywordController.js');

module.exports = function(app) {
  app.get('/key', apiController.getKey);
  app.get('/search', apiController.getSearch);
  app.get('/sentiment', apiController.getSentiment);
  app.get('/time', apiController.getTimeRange);
  app.post('/keywords', keywordController.addKeyword);
  app.get('/keywords', keywordController.getKeywords);
};
