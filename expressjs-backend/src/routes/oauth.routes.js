const controller = require("../controllers/oauth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://localhost:3000");
    // res.header("Referrer-Policy", "no-referrer-when-downgrade");
    // res.header(
    //   "Access-Control-Allow-Headers",
    //   "Origin, X-Requested-With, Content-Type, Accept"
    // );
  });

  app.get("/api/oauth", controller.oauthLogin);
};
