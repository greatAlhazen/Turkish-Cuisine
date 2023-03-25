import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  body: String,
  rating: Number,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Comment", CommentSchema);
