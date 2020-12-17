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
import cookieParser from "cookie-parser";

import jokeRoutes from "./routes/jokeRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const MongoStore = connectMongo(session);

// make server
const server = express();

// basic middleware
server.use(
  cors({
    credentials: true,
    origin: ["https://dadjoke-geq4lvxdn.vercel.app/", "http://localhost:3000"],
  })
);

server.use(helmet());
// server.use(
//   morgan(
//     "[:date[iso]] :method :url :status :res[content-length] - :response-time ms"
//   )
// );
server.use(morgan("dev"));

server.use(cookieParser()); // read cookies (needed for auth)
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// session middleware
server.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      collection: "sessions",
      autoRemove: "interval",
      autoRemoveInterval: 10, // in minutes
      touchAfter: 1 * 3600, // time in seconds -- one hour
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    },
    rolling: true,
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

// export
export default server;
