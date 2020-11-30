import passport from "passport";
import User from "../models/user.js";
import bcrypt from "bcrypt";

export function login(req, res, next) {
  passport.authenticate("login", (err, user, info) => {
    // if err

    // if no user

    res.status(200).json(user);
  });
}

export function logout(req, res) {
  req.session.destroy();
  return res.status(200);
}

export function signup(req, res, next) {
  console.log("inside signup");
  User.findOne({ username: req.body.username }).exec((err, user) => {
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
            req.login();
            res.status(200).json(user);
          })
          .catch((err) => console.log(err));
      });
    });
  });
}
