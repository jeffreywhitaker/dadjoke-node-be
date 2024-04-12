import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import passport from "passport";
import passportConfig from "./config/passportConfig.js";
import { setupCors } from "./config/corsConfig.js";
import { setupSession } from "./config/sessionConfig.js";

import jokeRoutes from "./routes/jokeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import mbThreadRoutes from "./routes/mbThreadRoutes.js";
import mbCommentRoutes from "./routes/mbCommentRoutes.js";
import { setupLogging } from "./config/loggingConfig.js";

// make server
const server = express();

// basic middleware
setupCors(server);
server.use(helmet());
setupLogging(server);

server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
server.use(bodyParser.json({ limit: "50mb", extended: true }));

setupSession(server);
passportConfig(passport, server);

// rate limits?

// routes
server.use("/api/jokes/", jokeRoutes);
server.use("/api/users/", userRoutes);
server.use("/api/comments/", commentRoutes);
server.use("/api/mbthread/", mbThreadRoutes);
server.use("/api/mbcomment/", mbCommentRoutes);

// export
export default server;
