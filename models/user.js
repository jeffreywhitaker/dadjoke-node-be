import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // login
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  description: { type: String },
  image: { data: Buffer, contentType: String },

  // mb
  mbThreadCount: { type: Number, default: 0 },
  mbCommentCount: { type: Number, default: 0 },

  // voting
  jokesUpvoted: [{ type: mongoose.Schema.Types.ObjectId, ref: "DadJoke" }],
  jokesDownvoted: [{ type: mongoose.Schema.Types.ObjectId, ref: "DadJoke" }],

  // following
  followingUsers: [{ type: String, ref: "User" }],
  followedByUsers: [{ type: String, ref: "User" }],

  // misc
  jokeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  isAdmin: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
