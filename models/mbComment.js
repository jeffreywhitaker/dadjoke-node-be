import mongoose from "mongoose";
import mbText from "./mbText.js";
const Schema = mongoose.Schema;

const mbComment = new Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  creatorName: { type: String, ref: "User" },
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: "MbThread" },
  text: { type: String, default: "" },
  textHistory: { type: [mbText], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MbComment", mbComment);
