import mongoose from "mongoose";

const dbConnection = (url) => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`connection opened ${data.connection.host}`);
    })
    .catch((err) => console.log(err));
};

export default dbConnection;
