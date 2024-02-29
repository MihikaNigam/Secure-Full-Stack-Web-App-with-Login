const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const cookieSession = require("cookie-session");
var RateLimit = require('express-rate-limit');

const { connectDB } = require("./src/config/db.config");
const port = process.env.PORT || 8000;

const app = express()
  .use(cors({ origin: "https://localhost:3000", credentials: true }))
  .use(express.json());
app.use(
  cookieSession({
    name: "reactApp-session",
    keys: [process.env.COOKIE_SECRET],
    httpOnly: true,
    secure: true,
    sameSite: "strict", //mitigates csrf risks
  })
);


// set up rate limiter: maximum of five requests per minute
var limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// apply rate limiter to all requests
app.use(limiter);

//routes
require("./src/routes/auth.routes")(app);
require("./src/routes/user.routes")(app);
require("./src/routes/oauth.routes")(app);

//db connect
connectDB();

//add certs for http
const options = {
  key: fs.readFileSync("./certs/key.pem"),
  cert: fs.readFileSync("./certs/cert.pem"),
};
const server = https.createServer(options, app);

//start server
server.listen(port, () => {
  console.log(`App listening at https://localhost:${port}`);
});
