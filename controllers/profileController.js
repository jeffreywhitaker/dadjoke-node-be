import User from "../models/user.js";
import DadJoke from "../models/jokes.js";

export async function getProfileStats(req, res) {
  try {
    console.log("user is: ", req.user);
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
    // user description
    objToSend.description = user.description;

    // send
    res.status(200).json(objToSend);
  } catch (error) {
    res.status(400).json({ error });
  }
}

export async function updateUserDescription(req, res) {
  if (!req.user || !req.user._id)
    return res.status(400).json({ error: "you must be logged in" });
  if (!req.body || !req.body.newDescription)
    return res.status(400).json({ error: "no description provided" });
  if (req.body.newDescription.length > 400)
    return res
      .status(404)
      .json({ error: "description is too long, must be under 400 characters" });

  try {
    const user = req.user;
    user.description = req.body.newDescription;
    user.save();
    res.sendStatus(200);
  } catch (error) {
    res.send(400).json({ error });
  }
}
