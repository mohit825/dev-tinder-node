const validator = require("validator");

const validateSignUpData = (req) => {
  const { email, firstName, lastName, password } = req.body;
  console.log(req.body);
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!!");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a Strong Password");
  }
};

module.exports = validateSignUpData;
