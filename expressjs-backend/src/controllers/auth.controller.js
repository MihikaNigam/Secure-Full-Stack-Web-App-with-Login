const db = require("../models");
const { OAuth2Client } = require("google-auth-library");
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

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://localhost:8000/api/oauth"
);

// Redirect to Google OAuth consent screen
exports.oauthUrlRequest = async (req, res) => {
  try {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: "https://www.googleapis.com/auth/userinfo.profile openid",
      prompt: "consent",
    });
    return res.send({ url: authorizeUrl });
  } catch (error) {
    console.log("go this error: ", error);
    return res.status(500).send({ message: error.message });
  }
};

exports.oauthLogin = async (req, res) => {
  try {
    const { code } = req.query;
    const result = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(result.tokens);
    const user = oAuth2Client.credentials;
    const userData = await getUserData(user.access_token);
    token = generateToken(userData.sub);
    const existingUser = await User.findOne({
      username: userData.family_name + userData.given_name,
    });
    if (existingUser) {
    } else {
      const u = new User({
        username: userData.family_name + userData.given_name,
        password: await bcrypt.hash(user.id_token, 8),
      });
      await u.save();
    }
    req.session.token = token;
    return res.redirect(
      303,
      `https://localhost:3000?cookie=${token}&user=${
        userData.family_name + userData.given_name
      }`
    );
  } catch (err) {
    console.log("Error with signin with Google", err);
    return res.status(500).send({ message: err.message });
  }
};

async function getUserData(access_token) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  return await response.json();
}
