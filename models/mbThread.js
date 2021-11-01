import mongoose from "mongoose";
import mbText from "./mbText.js";
const Schema = mongoose.Schema;

const mbThreadSchema = new Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  creatorName: { type: String, ref: "User" },
  text: { type: String, default: "" },
  textHistory: [mbText],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "MbComment" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MbThread", mbThreadSchema);
