exports.home = function(req, res) {
    res.redirect('/');
};
exports.submit = function(req, res) {
  res.render('submit');
    
};
exports.register = function(req, res) {
  res.render('register');
};
exports.profile = function(req, res) {
    if (typeof req.session.username == 'undefined') res.redirect('/');
    else res.render('profile', { title: 'edit profile', username: req.session.username });
};