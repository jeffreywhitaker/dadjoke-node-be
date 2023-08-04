import mongoose from "mongoose";

import { config } from "dotenv";
config();

const MONGODB_URI = process.env.MONGODB_URI;

function connectDB() {
  return mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
}

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
  console.log("Connected to Database");
});

export default connectDB;
