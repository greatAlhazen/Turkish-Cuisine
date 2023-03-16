import express from "express";
import path from "path";
import dbConnection from "./config/db.js";
import dotenv from "dotenv";
import Food from "./models/food.js";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import createError from "./utils/error.js";
import catchAsync from "./utils/catchAsync.js";
import { foodSchema } from "./joi-schemas.js";
import Comment from "./models/comment.js";
import { commentSchema } from "./joi-schemas.js";

//bug solved related path
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//env config
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

//initialize app
const app = express();

//database connection
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/food";
dbConnection(DB_URL);

//ejsMate template initialize for layout
app.engine("ejs", ejsMate);
//ejs template usage
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// joi validation
const foodValidation = (req, res, next) => {
  const { error } = foodSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((e) => e.message).join(",");
    next(createError(400, errorMessage));
  } else {
    next();
  }
};

const commentValidation = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((e) => e.message).join(",");
    next(createError(400, errorMessage));
  } else {
    next();
  }
};

//body parser for post
app.use(express.urlencoded({ extended: true }));

//method override for put and delete
app.use(methodOverride("_method"));

//test routes
app.get("/", (req, res) => {
  res.render("home");
});

//food test routes
app.get(
  "/foods",
  catchAsync(async (req, res) => {
    const foods = await Food.find({});
    res.render("foods/all", { foods });
  })
);

app.get("/foods/new", (req, res) => {
  res.render("foods/new");
});

app.post(
  "/foods",
  foodValidation,
  catchAsync(async (req, res) => {
    const food = new Food(req.body.food);
    await food.save();
    res.redirect(`/foods/${food._id}`);
  })
);

app.get(
  "/foods/:id",
  catchAsync(async (req, res) => {
    const food = await Food.findById(req.params.id).populate("comments");
    res.render("foods/one", { food });
  })
);

app.get(
  "/foods/:id/edit",
  catchAsync(async (req, res) => {
    const food = await Food.findById(req.params.id);
    res.render("foods/edit", { food });
  })
);

app.put(
  "/foods/:id",
  foodValidation,
  catchAsync(async (req, res) => {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { ...req.body.food },
      { new: true }
    );

    res.redirect(`/foods/${food._id}`);
  })
);

app.delete(
  "/foods/:id",
  catchAsync(async (req, res) => {
    await Food.findByIdAndDelete(req.params.id);
    res.redirect("/foods");
  })
);

//comment routes
app.post(
  "/foods/:id/comments",
  commentValidation,
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const food = await Food.findById(id);
    const comment = new Comment(req.body.comment);
    food.comments.push(comment);
    await comment.save();
    await food.save();
    res.redirect(`/foods/${food._id}`);
  })
);

app.delete(
  "/foods/:foodId/comments/:commentId",
  catchAsync(async (req, res) => {
    const { foodId, commentId } = req.params;
    await Food.findByIdAndUpdate(foodId, {
      $pull: { comments: commentId },
    });
    await Comment.findByIdAndDelete(commentId);
    res.redirect(`/foods/${foodId}`);
  })
);

// doesn't exists page
app.use("*", (req, res, next) => {
  next(createError(404, "Page Not Found"));
});

//custom error middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  const stack = err.stack;
  res.status(status).render("error", { status, message, stack });
});

//application listen on specified port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
