import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

function connectDB() {
  return mongoose.connect(MONGODB_URI, options);
}

mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error:")
);
mongoose.connection.once("open", () => {
  console.log("Connected to Database");
});

export default connectDB;
