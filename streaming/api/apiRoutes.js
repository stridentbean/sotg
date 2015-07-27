var apiController = require('./apiController.js');

module.exports = function(app, keywords) {
  app.get('/ping', apiController.ping);
  app.post('/keywords', /**TODO middleware.authenticate,*/ apiController.addKeyword);
  app.delete('/keywords', /**TODO middleware.authenticate,*/ apiController.deleteKeyword);

  apiController.setKeywords(keywords);  //sharing keyorks with the controller
};
