import mongoose from "mongoose";
import passportLocal from "passport-local";

const LocalStrategy = passportLocal.Strategy;
import "../models/user.js";
const User = mongoose.model("User");

export default function passportConfig(passport) {
  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (_id, done) {
    User.findById(_id).exec(function (err, user) {
      done(err, user);
    });
  });

  passport.use(
    new LocalStrategy(function (username, password, done) {
      console.log("inside local Strat");
      console.log("username, password");
      console.log("username", username);
      console.log("password", password);
      User.findOne({ username }, (err, user) => {
        console.log("inside local strat user find one");
        // if err
        if (err) return done(err, null);

        // if user already found
        if (user) return done(null, user);

        return done(null, null);
      });
    })
  );
}
