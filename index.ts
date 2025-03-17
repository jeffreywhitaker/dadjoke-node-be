import { createServer } from "node:http";
import connectDB from "./config/dbConfig.js";
import server from "./server.js";
import { websocketServer } from "./websocket/socket.js";

const httpServer = createServer(server);
websocketServer(httpServer);

await connectDB();
const port = process.env.PORT || 5000;
// server.listen(port, () => console.log(`Joke server listening on: ${port}`));
httpServer.listen(port, () => console.log(`Joke server listening on: ${port}`));
