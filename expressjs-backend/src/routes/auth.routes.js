const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://localhost:3000");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    // res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/signup", controller.signup);
  app.post("/api/auth/signout", controller.signout);
  app.post("/api/auth/validate", controller.validatePassword);
};
