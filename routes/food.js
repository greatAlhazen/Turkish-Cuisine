import express from "express";
const router = express.Router();
import catchAsync from "../utils/catchAsync.js";
import Food from "../models/food.js";
import createError from "../utils/error.js";
import { foodSchema } from "../joi-schemas.js";

const foodValidation = (req, res, next) => {
  const { error } = foodSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((e) => e.message).join(",");
    next(createError(400, errorMessage));
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const foods = await Food.find({});
    res.render("foods/all", { foods });
  })
);

router.get("/new", (req, res) => {
  res.render("foods/new");
});

router.post(
  "/",
  foodValidation,
  catchAsync(async (req, res) => {
    const food = new Food(req.body.food);
    await food.save();
    req.flash("success", "Successfully create food!");
    res.redirect(`/foods/${food._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const food = await Food.findById(req.params.id).populate("comments");
    if (!food) {
      req.flash("error", "Cannot find food!");
      return res.redirect("/foods");
    }
    res.render("foods/one", { food });
  })
);

router.get(
  "/:id/edit",
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
  catchAsync(async (req, res) => {
    await Food.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted food!");
    res.redirect("/foods");
  })
);

export default router;
