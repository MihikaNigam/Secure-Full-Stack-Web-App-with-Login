const config = require("../config/auth.config");
const db = require("../models");
const jwt = require("jsonwebtoken");

exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (validLogin(username, password)) {
      const token = generateToken(username);
      return res.status(200).send({
        message: "Successfully Authenticated",
        body: { token: token },
      });
    } else {
      return res.status(401).send({
        message: "Invalid Username or Password!",
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { username } = req.body;
    if (username == "") {
      return res.status(400).send({
        message: "Username cannot be empty",
      });
    }
    if (db.find((e) => e.username == username) != null) {
      return res.status(400).send({
        message: "Username already Exists. Try logging in",
      });
    }
    db.push(req.body);
    return res.status(200).send({
      message: "Successfully Registered",
    });
  } catch (error) {
    console.log("error is ", error);
    return res.status(500).send({ message: error.message });
  }
};
exports.users = async (req, res) => {
  try {
    return res.status(200).send({
      message: "Successfully Registered",
      body: { users: db },
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.validatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    // Check for at least one capital letter
    if (!/[A-Z]/.test(password)) {
      return res.status(400).send({
        message: "Password must contain at least one capital letter.",
      });
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      return res
        .status(400)
        .send({ message: "Password must contain at least one number." });
    }

    // Check for at least one symbol
    if (!/[!@#$%^&*()-=_+[\]{}|;:'",.<>/?\\`~]/.test(password)) {
      return res
        .status(400)
        .send({ message: "Password must contain at least one symbol." });
    }

    // Password is valid
    return res.status(200).send({ message: "Password is valid." });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const validLogin = (username, password) => {
  //to avoid hackers from guessing the password, random delay in each pass check
  const user = db.find((e) => e.username == username);
  setTimeout(() => {}, Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000);
  if (user) {
    return username == user.username && password == user.password;
  } else {
    return false;
  }
};

const generateToken = (username) => {
  const secretKey = config.secret;
  const payload = {
    username: username,
  };
  return jwt.sign(payload, secretKey, {
    algorithm: "HS256",
    expiresIn: 3600, // 24 hours
  });
};
