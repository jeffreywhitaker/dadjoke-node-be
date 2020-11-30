import User from "../models/user.js";
import bcrypt from "bcrypt";
import passport from "passport";

export const login = (req, res, next) => {
  console.log("inside login func 1");
  passport.authenticate("local", function (err, user) {
    console.log("inside login func 2");
    console.log("err", err);
    console.log("user", user);
    console.log("req", req.body);
    // if err
    if (err) throw err;

    // if no user
    if (!user) throw err;

    console.log("before logIn");
    return res.status(200);

    req.logIn(user, function (err) {
      console.log("after logIn");
      console.log("err", err);
      if (err) console.log("weird err", err);
      console.log("after login 2");
      return res.status(200);
    });
  })(req, res, next);
};

export function logout(req, res) {
  try {
    req.session.destroy();
    return res.status(200);
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
            req.logIn(user, function (err) {
              if (err) res.status(400).json(err);
              res.status(200);
            });
          })
          .catch((err) => console.log(err));
      });
    });
  })(req, res, next);
}

export function deleteSelf(req, res, next) {
  console.log("inside delete");
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.status(400).json({ error: "no user" });
    try {
      user.destroy();
      res.status(200);
    } catch (error) {
      res.status(400).json({ error });
    }
  });
}
