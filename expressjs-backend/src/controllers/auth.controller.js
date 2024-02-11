const db = require("../models");
const User = db.user;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    isvalid = await validLogin(username, password);
    if (!isvalid) {
      return res.status(401).send({
        message: "Invalid Username or Password!",
      });
    }
    const token = generateToken(username);
    req.session.token = token; //Represents the session for the given request.

    return res.status(200).send({
      message: "Successfully Authenticated",
      cookie: token,
    });
  } catch (error) {
    console.log("error is ", error);
    return res.status(500).send({ message: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    const savedUser = await user.save();
    console.log("user saved : ", savedUser);
    return res.status(200).send({
      message: "Successfully Registered",
    });
  } catch (error) {
    if (error.code == 11000) {
      return res
        .status(400)
        .send({ message: "Username already Exists. Try logging in." });
    } else if (error.name == "ValidationError") {
      return res.status(400).send({ message: "Username cannot be empty" });
    }
    return res
      .status(500)
      .send({ message: "Something went wrong. Couldn't register user." });
  }
};
exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
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

const validLogin = async (username, password) => {
  //to avoid hackers from guessing the password, random delay in each pass check

   //to ensure that the user input is interpreted as a literal value and not as a query object, In Mongoose, when you use the { field: value } syntax, it automatically performs an equality check, and there's no need to explicitly use $eq
   const user = await User.findOne({ username });
  
   if (!user) {
    return false;
  }
  const passwordIsValid = bcrypt.compareSync(password, user.password);
  setTimeout(() => {}, Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000);
  if (!passwordIsValid) {
    return false;
  }
  return true;
};

const generateToken = (username) => {
  const secretKey = process.env.TOKEN_SECRET; // config.secret;
  const payload = {
    username: username,
  };
  return jwt.sign(payload, secretKey, {
    algorithm: "HS256",
    expiresIn: 3600, // 24 hours
  });
};
