import mongoose from "mongoose";
const Schema = mongoose.Schema;
import Comment from "./comment.js";

const FoodSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  image: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

//delete associated comments
FoodSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Comment.deleteMany({
      _id: {
        $in: doc.comments,
      },
    });
  }
});

export default mongoose.model("Food", FoodSchema);
