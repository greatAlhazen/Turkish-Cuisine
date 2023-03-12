import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  image: String,
});

export default mongoose.model("Food", FoodSchema);
