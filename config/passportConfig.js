import mongoose from "mongoose";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";

const LocalStrategy = passportLocal.Strategy;
import "../models/user.js";
const User = mongoose.model("User");

export default function passportConfig(passport) {
  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id).exec(function (err, user) {
      done(err, user);
    });
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      (username, password, next) => {
        console.log("inside local Strat");
        console.log("username, password");
        console.log("username", username);
        console.log("password", password);
        User.findOne({ username }, (err, user) => {
          console.log("inside local strat user find one");
          console.log("user", user);

          if (err) return next(err, false);

          // if no user
          if (!user) return next(null, false);

          // Check password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              // User matched
              return next(null, user);
            } else {
              return next(null, false);
            }
          });
        });
      }
    )
  );
}
