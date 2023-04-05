import mongoose from "mongoose";
const Schema = mongoose.Schema;
import Comment from "./comment.js";

const PhotoSchema = new Schema({
  url: String,
  filename: String,
});

// smallSize image for edit page
PhotoSchema.virtual("smallSize").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

// for pass json
const opts = { toJSON: { virtuals: true } };

const FoodSchema = new Schema(
  {
    title: String,
    description: String,
    price: Number,
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
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
  },
  opts
);

// for popup cluster map
FoodSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <strong><a href="/foods/${this._id}">${this.title}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`;
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
