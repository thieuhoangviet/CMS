export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view that resource');
  res.redirect('/users/login');
};

export const ensureAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }
  req.flash('error_msg', 'You do not have sufficient rights to view this page');
  res.redirect('/dashboard');
};


  