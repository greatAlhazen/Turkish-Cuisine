//env config
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
import path from "path";
import dbConnection from "./config/db.js";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import createError from "./utils/error.js";
import foodRouter from "./routes/food.js";
import commentRouter from "./routes/comment.js";
import session from "express-session";
import flash from "connect-flash";
import User from "./models/user.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import userRouter from "./routes/user.js";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import mongosessionStore from "connect-mongo";

const MongoDBStore = mongosessionStore(session);

//bug solved related path
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// guard Mongo injection
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

// session configuration
const SESSION_SECRET = process.env.SESSION_SECRET;

const store = new MongoDBStore({
  url: DB_URL,
  secret: SESSION_SECRET,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
  store,
  secret: SESSION_SECRET,
  resave: false,
  //for production
  // secure:true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 6,
    maxAge: 1000 * 60 * 60 * 24 * 6,
  },
};

app.use(session(sessionOptions));

// configure passport authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash configuration
app.use(flash());

// for add custom security headers
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://unpkg.com",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://unpkg.com",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = ["https://api.maptiler.com"];
const fontSrcUrls = ["https://cdnjs.cloudflare.com"];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      childSrc: ["blob"],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dptfiwkld/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use((req, res, next) => {
  // current user
  res.locals.user = req.user;
  // flash messages
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//body parser for post
app.use(express.urlencoded({ extended: true }));

//method override for put and delete
app.use(methodOverride("_method"));

// test routes
app.get("/", (req, res) => {
  res.render("home");
});

/* fake user test
app.get("/fake-user", async (req, res) => {
  const user = new User({ mail: "fake@gmail.com", username: "enes" });
  const savedUser = await User.register(user, "Password");
  res.send(savedUser);
}); */

//user routes
app.use("/", userRouter);

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
