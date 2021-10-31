import mongoose from "mongoose";
import mbText from "./mbText";
import mbComment from "./mbComment";
const Schema = mongoose.Schema;

const mbThreadSchema = new Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  creatorName: { type: String, ref: "User" },
  text: { type: String, default: "" },
  textHistory: { type: [mbText], default: [] },
  responses: { type: [mbResponse], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MbTopic", mbThreadSchema);
