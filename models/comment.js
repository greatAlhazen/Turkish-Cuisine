import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  body: String,
  rating: Number,
});

export default mongoose.model("Comment", CommentSchema);
