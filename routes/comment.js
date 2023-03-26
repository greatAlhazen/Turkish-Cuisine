import express from "express";
const router = express.Router({ mergeParams: true });
import catchAsync from "../utils/catchAsync.js";
import { isCommentOwner, loggedIn } from "../middleware.js";
import { commentValidation } from "../middleware.js";
import { createComment, deleteComment } from "../controllers/comment.js";

router.post("/", loggedIn, commentValidation, catchAsync(createComment));

router.delete(
  "/:commentId",
  loggedIn,
  isCommentOwner,
  catchAsync(deleteComment)
);

export default router;
