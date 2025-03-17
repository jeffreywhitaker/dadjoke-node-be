import mongoose, { InferSchemaType, Schema } from "mongoose";

const jokeSchema = new Schema({
  creator: { type: Schema.ObjectId, ref: "User" },
  username: { type: String, required: true },
  dadjokequestion: String,
  dadjokeanswer: String,
  isprivate: { type: Boolean, required: true },
  keywords: [{ type: String }],

  // votes
  karma: { type: Number, default: 0 },
  usersUpvoting: [{ type: Schema.ObjectId, ref: "User", unique: true }],
  usersDownvoting: [{ type: Schema.ObjectId, ref: "User", unique: true }],

  // misc
  commentCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export type DadJoke = InferSchemaType<typeof jokeSchema>;
export default mongoose.model("DadJoke", jokeSchema);
