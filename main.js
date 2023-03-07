import express from "express";
import path from "path";
import dbConnection from "./config/db.js";
import dotenv from "dotenv";
import Food from "./models/food.js";
import methodOverride from "method-override";

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

//ejs template usage
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//body parser for post
app.use(express.urlencoded({ extended: true }));

//method override for put and delete
app.use(methodOverride("_method"));

//test routes
app.get("/", (req, res) => {
  res.render("test");
});

//food test routes
app.get("/foods", async (req, res) => {
  const foods = await Food.find({});
  res.render("foods/all", { foods });
});

app.get("/foods/new", (req, res) => {
  res.render("foods/new");
});

app.post("/foods", async (req, res) => {
  const food = new Food(req.body.food);
  await food.save();
  res.redirect(`/foods/${food._id}`);
});

app.get("/foods/:id", async (req, res) => {
  const food = await Food.findById(req.params.id);
  res.render("foods/one", { food });
});

app.get("/foods/:id/edit", async (req, res) => {
  const food = await Food.findById(req.params.id);
  res.render("foods/edit", { food });
});

app.put("/foods/:id", async (req, res) => {
  const food = await Food.findByIdAndUpdate(
    req.params.id,
    { ...req.body.food },
    { new: true }
  );

  res.redirect(`/foods/${food._id}`);
});

app.delete("/foods/:id", async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.redirect("/foods");
});

//application listen on specified port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
