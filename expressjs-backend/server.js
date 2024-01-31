const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const { connectDB } = require("./src/config/db.config");
const port = process.env.PORT || 8000;

const app = express()
  .use(cors({ origin: "http://localhost:3000", credentials: true }))
  .use(express.json());
app.use(
  cookieSession({
    name: "reactApp-session",
    keys: [process.env.COOKIE_SECRET],
    httpOnly: true,
  })
);

//routes
require("./src/routes/auth.routes")(app);
require("./src/routes/user.routes")(app);

//db connect
connectDB();

//start server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
