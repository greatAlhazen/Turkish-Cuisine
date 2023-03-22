export const loggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You are not signed-in");
    return res.redirect("/signin");
  }

  next();
};
