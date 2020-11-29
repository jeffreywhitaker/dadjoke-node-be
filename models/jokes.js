import mongoose from "mongoose";
const Schema = mongoose.Schema;

const jokeSchema = new Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dadjokequestion: String,
  dadjokeanswer: String,
  isprivate: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("DadJoke", jokeSchema);
