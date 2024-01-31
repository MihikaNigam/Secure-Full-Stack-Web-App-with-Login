const controller = require("../controllers/user.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://localhost:3000");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    // ß
    next();
  });

  app.get("/api/users", [authJwt.verifyToken], controller.getUsers);
  app.get("/api/user", controller.findUser);
};
