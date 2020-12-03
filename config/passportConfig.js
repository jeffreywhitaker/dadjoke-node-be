import mongoose from "mongoose";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";

const LocalStrategy = passportLocal.Strategy;
import "../models/user.js";
const User = mongoose.model("User");

export default function passportConfig(passport) {
  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    console.log("serializing user: ", user);
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    console.log("deserializing with id ", id);
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
        console.log("inside local Strat");
        console.log("username, password");
        console.log("username", username);
        console.log("password", password);
        User.findOne({ username }, (err, user) => {
          if (err) return next(err, false);

          // if no user
          if (!user) return next(null, false);

          // Check password
          // if (!user.validPassword(password)) {
          //   return next(null, false, { message: "Incorrect password." });
          // }
          // console.log("calling next with user");
          // return next(null, user);

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
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

  // passport.use(
  //   new LocalStrategy(function (username, password, done) {
  //     User.findOne({ username: username }, function (err, user) {
  //       if (err) {
  //         return done(err);
  //       }
  //       if (!user) {
  //         return done(null, false, { message: "Incorrect username." });
  //       }
  //       if (!user.validPassword(password)) {
  //         return done(null, false, { message: "Incorrect password." });
  //       }
  //       return done(null, user);
  //     });
  //   })
  // );
}
