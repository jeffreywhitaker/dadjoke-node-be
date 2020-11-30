import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
