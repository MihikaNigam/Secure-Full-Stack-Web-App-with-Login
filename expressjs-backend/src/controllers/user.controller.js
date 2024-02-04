const db = require("../models");
const User = db.user;
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');;
    res.status(200).json({ data: users });
  } catch (error) {
    console.error("error in getuser", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const findUser = async (req, res) => {
  try {
    let query = {};

    if (req.query.id) {
      query._id = req.query.id;
    }

    if (req.query.name) {
      query.name = { $regex: new RegExp(req.query.name, "i") };
    }

    if (req.query.job) {
      query.job = { $regex: new RegExp(req.query.job, "i") };
    }
  } catch (error) {}
};

module.exports = { getUsers, findUser };
