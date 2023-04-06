import { foodSchema, commentSchema } from "./joi-schemas.js";
import Food from "./models/food.js";
import createError from "./utils/error.js";
import Comment from "./models/comment.js";

export const loggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Öncelikle giriş yapmalısın");
    return res.redirect("/signin");
  }

  next();
};

export const foodValidation = (req, res, next) => {
  const { error } = foodSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((e) => e.message).join(",");
    next(createError(400, errorMessage));
  } else {
    next();
  }
};

export const commentValidation = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((e) => e.message).join(",");
    next(createError(400, errorMessage));
  } else {
    next();
  }
};

export const isOwner = async (req, res, next) => {
  const food = await Food.findById(req.params.id);
  if (!food.owner.equals(req.user._id)) {
    req.flash("error", "Buna yetkili değilsin");
    return res.redirect(`/foods/${req.params.id}`);
  }
  next();
};

export const isCommentOwner = async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment.owner.equals(req.user._id)) {
    req.flash("error", "Buna yetkili değilsin");
    return res.redirect(`/foods/${req.params.foodId}`);
  }
  next();
};
