import express from "express";
const router = express.Router();
import User from "../models/user.js";
import catchAsync from "../utils/catchAsync.js";
import passport from "passport";
import {
  getLogin,
  getRegister,
  logout,
  postLogin,
  postRegister,
} from "../controllers/user.js";

router.route("/signup").get(getRegister).post(catchAsync(postRegister));

router
  .route("/signin")
  .get(getLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/signin",
      keepSessionInfo: true,
    }),
    postLogin
  );

router.get("/signin");

router.get("/logout", logout);
export default router;
