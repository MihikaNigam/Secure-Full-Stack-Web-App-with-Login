const jwt = require("jsonwebtoken");
const db = require("./../models");

const dotenv = require("dotenv");
dotenv.config();

verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(401).send({ message: "Not Authorized. No Token." });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.username = decoded.username;
    next();
  });
};

const authJwt = {
    verifyToken,
  };
  module.exports = authJwt;