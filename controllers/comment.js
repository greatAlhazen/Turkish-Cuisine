import Food from "../models/food.js";
import Comment from "../models/comment.js";

export const createComment = async (req, res) => {
  const foodId = req.params.foodId;
  const food = await Food.findById(foodId);
  const comment = new Comment(req.body.comment);
  comment.owner = req.user._id;
  food.comments.push(comment);
  await comment.save();
  await food.save();
  req.flash("success", "Başarıyla oluşturuldu!");
  res.redirect(`/foods/${food._id}`);
};

export const deleteComment = async (req, res) => {
  const { foodId, commentId } = req.params;
  await Food.findByIdAndUpdate(foodId, {
    $pull: { comments: commentId },
  });
  await Comment.findByIdAndDelete(commentId);
  req.flash("success", "Başarıyla silindi");
  res.redirect(`/foods/${foodId}`);
};
