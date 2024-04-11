import mongoose from "mongoose";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";

const LocalStrategy = passportLocal.Strategy;
import "../models/user.js";
const User = mongoose.model("User");
// test

export default function passportConfig(passport, server) {
  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    console.log("serializing user: ", user);
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    console.log("deserializing: ", id);
    User.findById(id).exec(function (err, user) {
      console.log("deserialized and found user ", user);
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
        User.findOne({ username }, (err, user) => {
          // if err send error and false user
          if (err) return next(err, false);

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
        });
      }
    )
  );

  server.use(passport.initialize());
  server.use(passport.session());
}
