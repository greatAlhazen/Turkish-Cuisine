import express from "express";
import path from "path";
import dbConnection from "./config/db.js";
import dotenv from "dotenv";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import createError from "./utils/error.js";
import foodRouter from "./routes/food.js";
import commentRouter from "./routes/comment.js";
import session from "express-session";
import flash from "connect-flash";

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

// static assets
app.use(express.static(path.join(__dirname, "assets")));

// session configuration
const SESSION_SECRET = process.env.SESSION_SECRET;

const sessionOptions = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 6,
    maxAge: 1000 * 60 * 60 * 24 * 6,
  },
};

app.use(session(sessionOptions));

// flash configuration
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//body parser for post
app.use(express.urlencoded({ extended: true }));

//method override for put and delete
app.use(methodOverride("_method"));

//test routes
app.get("/", (req, res) => {
  res.render("home");
});

//food routes
app.use("/foods", foodRouter);

//comment routes
app.use("/foods/:foodId/comments", commentRouter);

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
