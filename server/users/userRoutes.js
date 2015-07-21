var userController = require('./userController.js'), 
    sessionUtils = require('../utils/session.js');

/**
 * A module that routes user activities
 * @module users/userRoutes
 */

module.exports = function(app) {
  app.post('/signin', userController.signin);
  app.post('/signup', userController.signup);
  app.get('/logout', sessionUtils.checkUser, userController.logout);
  app.get('/profile', sessionUtils.checkUser, userController.getProfile);
};
