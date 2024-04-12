import mongoose from "mongoose";
import connectMongo from "connect-mongo";
import session from "express-session";

const MongoStore = connectMongo(session);

export function setupSession(server) {
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
}
