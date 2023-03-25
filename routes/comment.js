import express from "express";
const router = express.Router({ mergeParams: true });
import Food from "../models/food.js";
import Comment from "../models/comment.js";
import catchAsync from "../utils/catchAsync.js";
import { isCommentOwner, loggedIn } from "../middleware.js";
import { commentValidation } from "../middleware.js";

router.post(
  "/",
  loggedIn,
  commentValidation,
  catchAsync(async (req, res) => {
    const foodId = req.params.foodId;
    const food = await Food.findById(foodId);
    const comment = new Comment(req.body.comment);
    comment.owner = req.user._id;
    food.comments.push(comment);
    await comment.save();
    await food.save();
    req.flash("success", "Created comment!");
    res.redirect(`/foods/${food._id}`);
  })
);

router.delete(
  "/:commentId",
  loggedIn,
  isCommentOwner,
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
