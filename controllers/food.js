import Food from "../models/food.js";
import { cloudinaryVTwo } from "../config/cloudinary.js";
import opencage from "opencage-api-client";

export const getFoods = async (req, res) => {
  const foods = await Food.find({});
  res.render("foods/all", { foods });
};

export const createFood = async (req, res) => {
  const response = await opencage.geocode({ q: req.body.food.location });
  const { lat, lng } = response.results[0].geometry;
  const food = new Food(req.body.food);
  food.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  // prettier-ignore
  food.geometry = { "type": "Point", "coordinates": [lng, lat] };
  food.owner = req.user._id;
  await food.save();
  req.flash("success", "Başarıyla yaratıldı!");
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
    req.flash("error", "Maalesed bulunamadı!");
    return res.redirect("/foods");
  }
  res.render("foods/one", { food });
};

export const updateFood = async (req, res) => {
  const oldFood = await Food.findById(req.params.id);
  if (oldFood.location !== req.body.food.location) {
    const response = await opencage.geocode({ q: req.body.food.location });
    const { lat, lng } = response.results[0].geometry;
    // prettier-ignore
    req.body.food.geometry = { "type": "Point", "coordinates": [lng, lat] };
  }

  console.log(req.body.food.mapLocation);
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

  req.flash("success", "Başarılı bir şekilde güncellendi!");
  res.redirect(`/foods/${food._id}`);
};

export const deleteFood = async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  req.flash("success", "Başarıyla silindi!");
  res.redirect("/foods");
};

export const getEditPage = async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) {
    req.flash("error", "Maalasef bulunamadı!");
    return res.redirect("/foods");
  }
  res.render("foods/edit", { food });
};
