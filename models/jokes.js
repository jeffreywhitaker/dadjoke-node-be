import mongoose from "mongoose";
const Schema = mongoose.Schema;

const jokeSchema = new Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: { type: String, required: true },
  dadjokequestion: String,
  dadjokeanswer: String,
  isprivate: { type: Boolean, required: true },
  keywords: [{ type: String }],

  // votes
  karma: { type: Number, default: 0 },
  usersUpvoting: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  ],
  usersDownvoting: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  ],

  // misc
  commentCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("DadJoke", jokeSchema);
