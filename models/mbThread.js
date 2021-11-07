import mongoose from "mongoose";
const Schema = mongoose.Schema;

const mbThreadSchema = new Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  creatorName: { type: String, ref: "User" },
  title: { type: String, required: true },
  titleHistory: [{ title: String, createdAt: { type: Date, default: Date.now() } }],
  text: { type: String, default: "" },
  textHistory: [{ text: String, createdAt: { type: Date, default: Date.now() } }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "MbComment" }],
  lastReply: { type: mongoose.Schema.Types.ObjectId, ref: "MbComment" },
  commentCount: { type: Number, default: 0 },
  lastEditedAt: { type: Date, default: null },
  lastReplyAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MbThread", mbThreadSchema);
