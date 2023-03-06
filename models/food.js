import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
  title: String,
  description: String,
  price: String,
  location: String,
});

export default mongoose.model("Food", FoodSchema);
