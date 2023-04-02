import express from "express";
const router = express.Router();
import catchAsync from "../utils/catchAsync.js";
import { isOwner, loggedIn } from "../middleware.js";
import { foodValidation } from "../middleware.js";
import multer from "multer";
import { storage } from "../config/cloudinary.js";

// file type control
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(createError(400, "File type not supported"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
});

import {
  createFood,
  deleteFood,
  getEditPage,
  getFood,
  getFoods,
  getNewFood,
  updateFood,
} from "../controllers/food.js";
import createError from "../utils/error.js";

router
  .route("/")
  .get(catchAsync(getFoods))
  .post(
    loggedIn,
    upload.array("photo"),
    foodValidation,
    catchAsync(createFood)
  );

router.get("/new", loggedIn, getNewFood);

router
  .route("/:id")
  .get(catchAsync(getFood))
  .put(
    loggedIn,
    isOwner,
    upload.array("photo"),
    foodValidation,
    catchAsync(updateFood)
  )
  .delete(loggedIn, isOwner, catchAsync(deleteFood));

router.get("/:id/edit", loggedIn, isOwner, catchAsync(getEditPage));

export default router;
