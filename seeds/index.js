import mongoose from "mongoose";
import Food from "../models/food.js";
import { places, foods } from "./helper.js";
import dbConnection from "../config/db.js";

const DB_URL = "mongodb://localhost:27017/food";
dbConnection(DB_URL);

const randomValue = (value) => value[Math.floor(Math.random() * value.length)];

const saveRandom = async () => {
  await Food.deleteMany({});

  for (let i = 0; i <= 20; i++) {
    const food = new Food({
      location: `${randomValue(places)}`,
      title: `${randomValue(foods)}`,
      description: `Lorem ipsum dolor sit amet,
             consectetur adipiscing elit, 
             sed do eiusmod tempor incididunt ut labore et`,
    });

    await food.save();
  }
};

saveRandom().then(() => mongoose.connection.close());
