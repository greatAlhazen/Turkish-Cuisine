import mongoose from "mongoose";

const dbConnection = (url) => {
  mongoose.set("strictQuery", false);
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.once("open", () => console.log(`connection opened`));
  mongoose.connection.on("error", () =>
    console.error.bind(console, "connection error:")
  );
};

export default dbConnection;
