import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";
import connectMongo from "connect-mongo";
import passportConfig from "./config/passportConfig.js";

import jokeRoutes from "./routes/jokeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import { getUserAvatar } from "./controllers/profileController.js";

const MongoStore = connectMongo(session);

// make server
const server = express();

// hack
server.get("/api/users/profile/avatar/:username", getUserAvatar);

// basic middleware
var whitelist = ["https://jeffsdadjokes.com", "http://localhost:3000"];
var corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS, origin is: ${origin}`));
    }
  },
};
server.use(cors(corsOptions));

// helmet and morgan
server.use(helmet());
if (process.env.NODE_ENV === "production") {
  server.use(
    morgan(
      "[:date[iso]] :method :url :status :res[content-length] - :response-time ms"
    )
  );
} else {
  server.use(morgan("dev"));
}

server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
server.use(bodyParser.json({ limit: "50mb", extended: true }));

// session middleware
server.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      collection: "sessions",
    }),
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    },
    rolling: true,
    proxy: true,
  })
);

// init passport
passportConfig(passport);
server.use(passport.initialize());
server.use(passport.session());

// rate limits?

// routes
server.use("/api/jokes/", jokeRoutes);
server.use("/api/users/", userRoutes);
server.use("/api/comments/", commentRoutes);

// export
export default server;
