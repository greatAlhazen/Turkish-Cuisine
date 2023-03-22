import express from "express";
const router = express.Router();
import User from "../models/user.js";
import catchAsync from "../utils/catchAsync.js";
import passport from "passport";

router.get("/signup", (req, res) => {
  res.render("user/register");
});

router.post(
  "/signup",
  catchAsync(async (req, res) => {
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
  })
);

router.get("/signin", (req, res) => {
  res.render("user/login");
});

router.post(
  "/signin",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/signin",
    keepSessionInfo: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome,nice to see you again :)");
    const backUrl = req.session.returnTo || "/foods";
    delete req.session.returnTo;
    res.redirect(backUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye,see you soon!");
    res.redirect("/foods");
  });
});

export default router;
