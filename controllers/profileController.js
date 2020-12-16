import User from "../models/user.js";
import DadJoke from "../models/jokes.js";

export async function getProfileStats(req, res) {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    const objToSend = {};
    // count number of public jokes
    objToSend.publicJokesCount = await DadJoke.countDocuments({
      creator: user._id,
      isprivate: false,
    });
    // count number of private jokes
    objToSend.privateJokesCount = await DadJoke.countDocuments({
      creator: user._id,
      isprivate: true,
    });
    // count number of upvotes
    objToSend.upvoteCount = user.jokesUpvoted.length;
    // count number of downvotes
    objToSend.downvoteCount = user.jokesDownvoted.length;
    // date account created
    objToSend.accountCreationDate = user.createdAt;
    // username
    objToSend.username = user.username;
    // users this user is following
    objToSend.followingUsers = user.followingUsers;
    // users who are following this user
    objToSend.followedByUsers = user.followedByUsers;

    // send
    res.status(200).json(objToSend);
  } catch (error) {
    res.status(400).json({ error });
  }
}
