//env config
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import cloudinary from "cloudinary";
const cloudinaryVTwo = cloudinary.v2;
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinaryVTwo.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryVTwo,
  params: {
    folder: "FoodApp",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

export { storage, cloudinaryVTwo };
