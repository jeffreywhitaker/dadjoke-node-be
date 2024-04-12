import morgan from "morgan";
const isProduction = process.env.NODE_ENV === "production";

export function setupLogging(server) {
  if (isProduction) {
    server.use(
      morgan("[:date[iso]] :method :url :status :res[content-length] - :response-time ms")
    );
  } else {
    server.use(morgan("dev"));
  }
}
