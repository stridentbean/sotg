exports.createSession = function(req, res, newUser) {
  req.session.regenerate(function() {
    req.session.user = newUser;
    res.status(200).end();
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
