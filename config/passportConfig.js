import mongoose from "mongoose";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";

const LocalStrategy = passportLocal.Strategy;
import "../models/user.js";
const User = mongoose.model("User");

const localStrategy = new LocalStrategy(
  { usernameField: "username", passwordField: "password" },
  async (username, password, next) => {
    try {
      const user = await User.findOne({ username });

      // if no user, send null and false user
      if (!user) return next(null, false);

      // if user, compare passwords
      bcrypt.compare(password, user.password, (err, isMatch) => {
        //if error
        if (err) throw err;

        // if no error and passwords match
        if (isMatch) {
          // User matched
          console.log("found user, return ", user);
          return next(null, user);
        } else {
          return next(null, false, { message: "Incorrect password." });
        }
      });
    } catch (error) {
      return next(error, false);
    }
  }
);

export default async function passportConfig(passport, server) {
  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    console.log("serializing user: ", user);
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(async function (id, done) {
    try {
      console.log("deserializing: ", id);
      done(null, await User.findById(id));
    } catch (error) {
      done(error, null);
    }
  });

  passport.use(localStrategy);

  server.use(passport.initialize());
  server.use(passport.session());
}
