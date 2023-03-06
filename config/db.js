import mongoose from "mongoose";

const dbConnection = (url) => {
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
