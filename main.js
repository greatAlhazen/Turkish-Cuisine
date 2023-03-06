import express from "express";
import path from "path";
import dbConnection from "./config/db.js";
import dotenv from "dotenv";

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

//test route
app.get("/", (req, res) => {
  res.render("test");
});

//application listen on specified port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
