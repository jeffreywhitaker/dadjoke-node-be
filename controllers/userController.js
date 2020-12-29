import User from "../models/user.js";
import bcrypt from "bcrypt";
import passport from "passport";
import DadJoke from "../models/jokes.js";

export const login = (req, res, next) => {
  passport.authenticate("local", function (err, user) {
    // if err
    if (err) return res.status(400).json({ error: err });

    // if no user
    if (!user) return res.status(400).json({ error: "no user found" });

    req.logIn(user, function (err) {
      if (err) console.log("login err", err);

      const username = user.username;

      res.status(200).json({ username });
    });
  })(req, res, next);
};

export function getUserFromCookie(req, res) {
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
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(400).json({ error: err });
    if (user) return res.status(400).json("user already exists");

    const newUser = new User();
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
              if (error) return res.status(400).json({ error });

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
    const user = req.user;
    const username = user.username;
    if (!user) return res.status(400).json({ error: "No user from cookie" });

    // remove the jokes
    DadJoke.find({ creator: user._id }).exec((err, jokes) => {
      jokes.forEach((joke) => {
        joke.destroy();
      });
    });

    // delete followed by references to this user in other users
    user.followingUsers.forEach((username) => {
      User.findOne({ username }).exec((error, otherUser) => {
        if (error) return res.status(400).json({ error });

        const index = otherUser.followedByUsers.indexOf(user.username);
        otherUser.followedByUsers.splice(index, 1);
        otherUser.save();
      });
    });

    // delete the following references
    user.followedByUsers.forEach((username) => {
      User.findOne({ username }).exec((error, otherUser) => {
        if (error) return res.status(400).json({ error });

        const index = otherUser.followingUsers.indexOf(user.username);
        otherUser.followingUsers.splice(index, 1);
        otherUser.save();
      });
    });

    // destroy the user and send
    user.destroy();
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ error });
  }
}
