import mongoose from "mongoose";
const Schema = mongoose.Schema;

const chatMessageSchema = new Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  clientOffset: { type: String, unique: true },
  createdAt: { type: DataTransfer, default: Date.now },
});

export default mongoose.model("ChatMessage", chatMessageSchema);
