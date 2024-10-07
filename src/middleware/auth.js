const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid token");
    }
    const decodedMessage = await jwt.verify(token, "secretkey");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("No user found");
    }

    // attaching find user to req.user
    req.user = user;
    next();
  } catch (error) {
    res.send("Something went Wrong...");
  }
};

module.exports = userAuth;
