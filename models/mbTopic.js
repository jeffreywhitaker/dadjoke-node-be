import mongoose from "mongoose";
import mbText from "./mbText";
import mbResponse from "./mbResponse";
const Schema = mongoose.Schema;

const mbTopicSchema = new Schema({
  creatorName: { type: String, ref: "User" },
  text: { type: String, default: "" },
  textHistory: { type: [mbText], default: [] },
  responses: { type: [mbResponse], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MbTopic", mbTopicSchema);
