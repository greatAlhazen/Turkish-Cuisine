import mongoose from "mongoose";
import Food from "../models/food.js";
import { foods } from "./helper.js";
import { turkeyCities } from "./turkeyCities.js";
import dbConnection from "../config/db.js";

const DB_URL = "mongodb://localhost:27017/food";
dbConnection(DB_URL);

const randomValue = (value) => value[Math.floor(Math.random() * value.length)];

const saveRandom = async () => {
  await Food.deleteMany({});

  for (let i = 0; i <= 80; i++) {
    const price = Math.floor(Math.random() * 80) + 5;
    const city = randomValue(turkeyCities);
    const food = new Food({
      owner: "6417fcd25a971dee8633f68e",
      location: city.name,
      title: `${randomValue(foods)}`,
      description: `Lorem ipsum dolor sit amet,consectetur adipiscing elit,sed do eiusmod tempor incididunt ut labore et`,
      price,
      geometry: {
        type: "Point",
        coordinates: [city.longitude, city.latitude],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dd0j3jaxj/image/upload/v1680075625/FoodApp/tzyn5ptigky4ad70ler5.jpg",
          filename: "FoodApp/tzyn5ptigky4ad70ler5",
        },
        {
          url: "https://res.cloudinary.com/dd0j3jaxj/image/upload/v1680075627/FoodApp/q1vwu7f43rn2bvbpdxsz.jpg",
          filename: "FoodApp/q1vwu7f43rn2bvbpdxsz",
        },
      ],
    });

    await food.save();
  }
};

saveRandom().then(() => mongoose.connection.close());
