exports.createSession = function(req, res, newUser) {
  return req.session.regenerate(function() {
    console.log('newUser: ' + newUser)
      req.session.user = newUser;
    });
};

exports.isLoggedIn = function(req, res) {

  return req.session ? !!req.session.user : false;
};

exports.checkUser = function(req, res, next){
  if (!exports.isLoggedIn(req)){
    res.status(403);
  } else {
    next();
  }
};
