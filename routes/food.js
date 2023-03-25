import express from "express";
const router = express.Router();
import catchAsync from "../utils/catchAsync.js";
import Food from "../models/food.js";
import { isOwner, loggedIn } from "../middleware.js";
import { foodValidation } from "../middleware.js";

router.get(
  "/",
  catchAsync(async (req, res) => {
    const foods = await Food.find({});
    res.render("foods/all", { foods });
  })
);

router.get("/new", loggedIn, (req, res) => {
  res.render("foods/new");
});

router.post(
  "/",
  loggedIn,
  foodValidation,
  catchAsync(async (req, res) => {
    const food = new Food(req.body.food);
    food.owner = req.user._id;
    await food.save();
    req.flash("success", "Successfully create food!");
    res.redirect(`/foods/${food._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
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
  })
);

router.get(
  "/:id/edit",
  loggedIn,
  isOwner,
  catchAsync(async (req, res) => {
    const food = await Food.findById(req.params.id);
    if (!food) {
      req.flash("error", "Cannot find food!");
      return res.redirect("/foods");
    }
    res.render("foods/edit", { food });
  })
);

router.put(
  "/:id",
  loggedIn,
  isOwner,
  foodValidation,
  catchAsync(async (req, res) => {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { ...req.body.food },
      { new: true }
    );
    req.flash("success", "Successfully updated food!");
    res.redirect(`/foods/${food._id}`);
  })
);

router.delete(
  "/:id",
  loggedIn,
  isOwner,
  catchAsync(async (req, res) => {
    await Food.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted food!");
    res.redirect("/foods");
  })
);

export default router;
