import mongoose from "mongoose";
const Schema = mongoose.Schema;

const mbTextSchema = new Schema({
  text: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MbText", mbTextSchema);
