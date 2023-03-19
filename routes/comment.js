import express from "express";
const router = express.Router({ mergeParams: true });
import Food from "../models/food.js";
import Comment from "../models/comment.js";
import catchAsync from "../utils/catchAsync.js";
import createError from "../utils/error.js";
import { commentSchema } from "../joi-schemas.js";

const commentValidation = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((e) => e.message).join(",");
    next(createError(400, errorMessage));
  } else {
    next();
  }
};

router.post(
  "/",
  commentValidation,
  catchAsync(async (req, res) => {
    const foodId = req.params.foodId;
    const food = await Food.findById(foodId);
    const comment = new Comment(req.body.comment);
    food.comments.push(comment);
    await comment.save();
    await food.save();
    req.flash("success", "Created comment!");
    res.redirect(`/foods/${food._id}`);
  })
);

router.delete(
  "/:commentId",
  catchAsync(async (req, res) => {
    const { foodId, commentId } = req.params;
    await Food.findByIdAndUpdate(foodId, {
      $pull: { comments: commentId },
    });
    await Comment.findByIdAndDelete(commentId);
    req.flash("success", "Successfully deleted comment");
    res.redirect(`/foods/${foodId}`);
  })
);

export default router;
