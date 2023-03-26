import express from "express";
const router = express.Router();
import catchAsync from "../utils/catchAsync.js";
import { isOwner, loggedIn } from "../middleware.js";
import { foodValidation } from "../middleware.js";
import {
  createFood,
  deleteFood,
  getEditPage,
  getFood,
  getFoods,
  getNewFood,
  updateFood,
} from "../controllers/food.js";

router
  .route("/")
  .get(catchAsync(getFoods))
  .post(loggedIn, foodValidation, catchAsync(createFood));

router.get("/new", loggedIn, getNewFood);

router
  .route("/:id")
  .get(catchAsync(getFood))
  .put(loggedIn, isOwner, foodValidation, catchAsync(updateFood))
  .delete(loggedIn, isOwner, catchAsync(deleteFood));

router.get("/:id/edit", loggedIn, isOwner, catchAsync(getEditPage));

export default router;
