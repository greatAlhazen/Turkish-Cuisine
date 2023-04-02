import mongoose from "mongoose";
const Schema = mongoose.Schema;
import Comment from "./comment.js";

const PhotoSchema = new Schema({
  url: String,
  filename: String,
});

PhotoSchema.virtual("smallSize").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const FoodSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  images: [PhotoSchema],
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
