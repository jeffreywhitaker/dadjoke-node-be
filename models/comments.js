import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  creatorName: { type: String, ref: "User" },
  joke: { type: mongoose.Schema.Types.ObjectId, ref: "DadJoke" },
  data: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Comment", commentSchema);
