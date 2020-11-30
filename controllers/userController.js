import passport from "passport";
import User from "../models/user.js";

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

export function signup(req, res) {
  return res.status(200).json(req.user);
}
