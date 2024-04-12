import cors from "cors";

export function setupCors(server) {
  const whitelist = [
    "https://jeffsdadjokes.com",
    "https://www.jeffsdadjokes.com",
    "http://localhost:3000",
  ];

  const corsOptions = {
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
