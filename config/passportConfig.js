import mongoose from "mongoose";
import LocalStrategy from "passport-local/Strategy";

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
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        const criteria = {
          email: email,
        };
        User.findOne(criteria).exec((err, user) => {
          if (err) return done(err);

          if (!user) return done(null, false, { error: "User not found" });

          return done(null, user, req.body);
        });
      }
    )
  );

  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        User.findOne({ email: email }).exec((err, user) => {
          // if err

          // if user already found

          User.generateHash(password, function (err, hash) {
            const newUser = new User();

            newUser.email = email;
            newUser.password = hash;

            newUser.save((err) => {
              if (err) throw err;

              return done(null, newUser);
            });
          });
        });
      }
    )
  );
}
