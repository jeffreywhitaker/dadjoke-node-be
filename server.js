import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";
import connectMongo from "connect-mongo";
// import passportConfig from "./config/passportConfig.js";

import jokeRoutes from "./routes/jokeRoutes.js";

const MongoStore = connectMongo(session);

// make server
const server = express();

// basic middleware
server.use(cors());
server.use(helmet());
server.use(morgan("combined"));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// session middleware
const storeOptions = {
  mongooseConnection: mongoose.connection,
  collection: "sessions",
};

const sessionStore = new MongoStore(storeOptions);

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
  },
};

server.use(session(sessionOptions));

// init passport
// passportConfig(passport);
// server.use(passport.initialize());
// server.use(passport.session());

// rate limits?

// routes?
server.use(jokeRoutes);

// export
export default server;
