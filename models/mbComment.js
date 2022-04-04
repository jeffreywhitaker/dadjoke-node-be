import mongoose from "mongoose";
const Schema = mongoose.Schema;

const mbComment = new Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  creatorName: { type: String, ref: "User" },
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: "MbThread" },
  text: { type: String, default: "" },
  isDeleted: { type: Boolean, default: false },
  textHistory: [{ text: String, createdAt: { type: Date, default: Date.now } }],
  lastEditedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MbComment", mbComment);
