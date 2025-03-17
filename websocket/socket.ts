import { Server } from "socket.io";
import ChatMessage from "../models/chatMessage.js";

export function websocketServer(httpServer) {
  const io = new Server(httpServer, {
    path: "/chat-socket/",
    serveClient: false,
    cors: {
      credentials: true,
      origin: [
        "https://jeffsdadjokes.com",
        "https://www.jeffsdadjokes.com",
        "http://localhost:3000",
      ],
    },
  });

  io.on("connection", async (socket) => {
    console.log("a user connected!: " + socket.conn.request.headers);
    console.log(`users joined: ${io.engine.clientsCount}`);
    socket.emit("user count", io.engine.clientsCount);
    socket.broadcast.emit("user join");

    // ON CHAT MESSAGE
    socket.on("chat message", async (message) => {
      console.log("message: " + message.text);

      // let chatMessage;
      // try {
      //   chatMessage = new ChatMessage({
      //     text: message.text,
      //     creator: message.creator,
      //     clientOffset: message.clientOffset,
      //     createdAt: Date.now(),
      //   });

      //   await chatMessage.save();
      // } catch (error) {
      //   // TODO: implement
      //   return;
      // }

      //@ts-ignore
      // io.emit("chat message", message, chatMessage._id);

      socket.broadcast.emit("chat message", message);
    });

    socket.on("get user count", async () => {
      socket.emit("user count", io.engine.clientsCount);
    });

    // ON DISCONNECT
    socket.on("disconnect", async (reason) => {
      console.log("user disconnected");
      socket.emit("user count", io.engine.clientsCount);
    });

    // socket.off();

    // if (!socket.recovered) {
    //   try {
    //     // TODO: search criteria
    //     const messages = await ChatMessage.find();

    //     for (const message of messages) {
    //       socket.emit("chat message", message, message._id);
    //     }

    //     console.log("fix me");
    //   } catch (error) {
    //     console.log("fix me");
    //   }
    // }
  });
}
