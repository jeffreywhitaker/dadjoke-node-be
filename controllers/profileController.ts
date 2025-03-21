import User from "../models/user.js";
import DadJoke from "../models/jokes.js";

export async function getProfileStats(req, res) {
  try {
    const username = req.params.username;
    const user: any = await User.findOne({ username });
    const objToSend = {} as any;
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
    // has avatar or not
    objToSend.hasAvatar = user.image && user.image.data;

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

export async function uploadUserAvatar(req, res) {
  try {
    const userId = req.user._id;

    if (req.files.image === undefined) {
      return res.status(400).json({ error: "you must select a file" });
    }

    const user: any = await User.findById(userId);
    user.image.data = req.files.image.data;
    user.image.contentType = req.files.image.mimetype;

    user.save();
    return res.status(200).json({ image: user.image.data });
  } catch (error) {
    return res.status(400).json({ error });
  }
}

export async function getUserAvatar(req, res) {
  try {
    const username = req.params.username;
    const user: any = await User.findOne({ username });
    const imageToSend = user.image;

    // res.set("Content-Type", imageToSend.contentType);
    res.contentType("json");
    // TODO: put behind cors and fix this
    res.set("Access-Control-Allow-Credentials", true);
    res.send(imageToSend);
  } catch (error) {
    res.status(400).json({ error });
  }
}

export async function deleteUserAvatar(req, res) {
  try {
    const userId = req.user._id;
    const user: any = await User.findById(userId);
    // delete the user image
    user.image = null;
    user.save();

    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ error });
  }
}
