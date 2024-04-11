import cors from "cors";

const isProduction = process.env.NODE_ENV === "production";

export function setupCors(server) {
  if (!isProduction) return;

  var whitelist = [
    "https://jeffsdadjokes.com",
    "https://www.jeffsdadjokes.com",
    "http://localhost:3000",
  ];
  var corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // callback(new Error(`Not allowed by CORS, origin is: ${origin}`));
        callback(new Error("Not allowed by CORS"));
        // res
        //   .status(400)
        //   .json({ error: `Origin ${origin} is not allowed by CORS policy` });
      }
    },
  };

  server.use(cors(corsOptions));
}
