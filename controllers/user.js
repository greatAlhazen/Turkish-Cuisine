import User from "../models/user.js";

export const getRegister = (req, res) => {
  res.render("user/register");
};

export const postRegister = async (req, res) => {
  try {
    const { username, mail, password } = req.body;
    const newUser = new User({ username, mail });
    const savedUser = await User.register(newUser, password);
    req.login(savedUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome :)");
      res.redirect("/foods");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
};

export const getLogin = (req, res) => {
  res.render("user/login");
};

export const postLogin = (req, res) => {
  req.flash("success", "Welcome,nice to see you again :)");
  const backUrl = req.session.returnTo || "/foods";
  delete req.session.returnTo;
  res.redirect(backUrl);
};

export const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye,see you soon!");
    res.redirect("/foods");
  });
};
