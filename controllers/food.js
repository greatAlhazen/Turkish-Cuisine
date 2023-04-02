import Food from "../models/food.js";
import { cloudinaryVTwo } from "../config/cloudinary.js";

export const getFoods = async (req, res) => {
  const foods = await Food.find({});
  res.render("foods/all", { foods });
};

export const createFood = async (req, res) => {
  console.log(req.body.food);
  const food = new Food(req.body.food);
  food.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  food.owner = req.user._id;
  console.log(food);
  await food.save();
  req.flash("success", "Successfully create food!");
  res.redirect(`/foods/${food._id}`);
};

export const getNewFood = (req, res) => {
  res.render("foods/new");
};

export const getFood = async (req, res) => {
  const food = await Food.findById(req.params.id)
    .populate({
      path: "comments",
      populate: {
        path: "owner",
      },
    })
    .populate("owner");
  if (!food) {
    req.flash("error", "Cannot find food!");
    return res.redirect("/foods");
  }
  res.render("foods/one", { food });
};

export const updateFood = async (req, res) => {
  const food = await Food.findByIdAndUpdate(
    req.params.id,
    { ...req.body.food },
    { new: true }
  );
  const imageArray = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  food.images.push(...imageArray);
  await food.save();
  if (req.body.images) {
    for (let filename of req.body.images) {
      await cloudinaryVTwo.uploader.destroy(filename);
    }
    await food.updateOne({
      $pull: { images: { filename: { $in: req.body.images } } },
    });
  }
  req.flash("success", "Successfully updated food!");
  res.redirect(`/foods/${food._id}`);
};

export const deleteFood = async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted food!");
  res.redirect("/foods");
};

export const getEditPage = async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) {
    req.flash("error", "Cannot find food!");
    return res.redirect("/foods");
  }
  res.render("foods/edit", { food });
};
