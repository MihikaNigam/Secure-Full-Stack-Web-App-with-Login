const dotenv = require("dotenv");
dotenv.config();
 const { OAuth2Client } = require("google-auth-library");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


// exports.oauthLogin = async (req, res) => {
//   passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "https://localhost:8000/oauth/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     // User profile is returned in `profile`. You might want to find or create a user in your DB.
//     // For simplicity, we're directly proceeding with the profile object.
//     return cb(null, profile);
//   }
// ));
// }




exports.oauthLogin = async (req, res) => {
  console.log("getting query code: ");
  const code = req.query.code;
  try {
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://localhost:8000/api/oauth"
    );
    console.log("getting auth token: ");
    const result = await oAuth2Client.getToken(code);
    console.log("setting auth token in ", result);
    oAuth2Client.setCredentials(result.tokens);
    console.log("gett auth token in ", oAuth2Client.credentials);
    const user = oAuth2Client.credentials;
    // show data that is returned from the Google call
    console.log("getting user data: ");
    await getUserData(user.access_token);
    // call your code to generate a new JWT from your backend, don't reuse Googles

    token = generateToken(user.appUser.userid);
    res.redirect(303, `https://localhost:3000/token=${token}`);
  } catch (err) {
    console.log("Error with signin with Google", err);
    res.redirect(303, "https://localhost:3000/");
  }
  return res;
};

async function getUserData(access_token) {
  console.log("i'm in");
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  // const data = await response.json();
  console.log("data fetched ", response);
}

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
