import mongoose from "mongoose";
import mbText from "./mbText";
const Schema = mongoose.Schema;

const mbResponse = new Schema({
  creatorName: { type: String, ref: "User" },
  text: { type: String, default: "" },
  textHistory: { type: [mbText], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MbTopic", mbResponse);
