import connectDB from "./config/dbConfig.js";
import server from "./server.js";

connectDB().then(() => {
  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`Joke server listening on: ${port}`);
  });
});
