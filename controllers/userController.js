import User from "../models/user.js";
import bcrypt from "bcrypt";
import passport from "passport";
import DadJoke from "../models/jokes.js";

export const login = (req, res, next) => {
  console.log("inside login func 1");
  passport.authenticate("local", function (err, user) {
    // if err
    if (err) throw err;

    // if no user
    if (!user) throw err;

    req.logIn(user, function (err) {
      if (err) console.log("weird err", err);

      const username = user.username;
      // const jokesUpvoted = user.jokesUpvoted;
      // const jokesDownvoted = user.jokesDownvoted;

      res.status(200).json({ username });
    });
  })(req, res, next);
};

export function getUserFromCookie(req, res) {
  console.log("user in req", req.user);

  try {
    const username = req.user.username;
    res.status(200).json({
      username,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}

export function logout(req, res) {
  try {
    req.session.destroy();
    return res.sendStatus(200);
  } catch (err) {
    return res.status(400).json(err);
  }
}

export function signup(req, res, next) {
  console.log("inside signup");
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (user) res.status(400).json("user already exists");

    const newUser = new User();
    console.log("hash func");
    newUser.username = req.body.username;
    newUser.email = req.body.primaryemail;
    newUser.password = req.body.password;

    bcrypt.genSalt(12, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => {
            req.logIn(user, function (error) {
              if (error) res.status(400).json({ error });

              const username = user.username;
              const jokesUpvoted = user.jokesUpvoted;
              const jokesDownvoted = user.jokesDownvoted;

              res.status(200).json({ username, jokesUpvoted, jokesDownvoted });
            });
          })
          .catch((err) => console.log(err));
      });
    });
  })(req, res, next);
}

export function deleteSelf(req, res, next) {
  try {
    DadJoke.find({ creator: req.user._id }).exec((err, jokes) => {
      jokes.forEach((joke) => {
        joke.destroy();
      });
    });

    User.findById(req.user._id).exec((err, user) => {
      if (!user) res.status(400).json({ error: "no user" });
      user.destroy();
      res.sendStatus(200);
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}

export async function getOwnProfileStats(req, res) {
  try {
    const objToSend = {};
    // count number of public jokes
    objToSend.publicJokesCount = await DadJoke.countDocuments({
      creator: req.user._id,
      isprivate: false,
    });
    // count number of private jokes
    objToSend.privateJokesCount = await DadJoke.countDocuments({
      creator: req.user._id,
      isprivate: true,
    });
    // count number of upvotes
    objToSend.upvoteCount = req.user.jokesUpvoted.length;
    // count number of downvotes
    objToSend.downvoteCount = req.user.jokesDownvoted.length;
    // date account created
    objToSend.accountCreationDate = req.user.createdAt;
    // username
    objToSend.username = req.user.username;

    // send
    res.status(200).json(objToSend);
  } catch (error) {
    res.status(400).json({ error });
  }
}

export async function getOtherUserProfileStats(req, res) {
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
    // send
    res.status(200).json(objToSend);
  } catch (error) {
    res.status(400).json({ error });
  }
}
