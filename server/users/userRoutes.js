var userController = require('./userController.js'), 
    sessionUtils = require('../utils/session.js');
var middleware = require('../api/middleware.js');
var keywordUserController  = require('../api/keywordUserController.js');

/**
 * A module that routes user activities
 * @module users/userRoutes
 */

module.exports = function(app) {
  app.get('/keywords', middleware.authAPIKey, userController.keywords);
  app.post('/signin', userController.signin);
  app.post('/signup', userController.signup);
  app.get('/logout', sessionUtils.checkUser, userController.logout);
  app.get('/profile', sessionUtils.checkUser, userController.getProfile);
  app.post('/password/forgot', userController.sendPasswordResetEmail);
  // app.post('/password/reset', userController.resetPassword);
};
