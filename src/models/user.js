const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "secretkey");

  return token;
};

userSchema.methods.validatePassword = async function (currPassword) {
  const user = this;
  const hashedPassword = user.password;
  isPasswordValid = await bcrypt.compare(currPassword, hashedPassword);
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
