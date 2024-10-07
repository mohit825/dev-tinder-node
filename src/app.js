const express = require("express");
const { isEmpty } = require("lodash");
const connectDB = require("./config/database");
const { app, startServer } = require("./config/server");
const User = require("./models/user");
const validateSignUpData = require("./utils/validation");
const cookieParser = require("cookie-parser");
const userAuth = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser());

// SignUp API for user
app.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);
    // Encrypt the data
    const { firstName, lastName, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const userObj = {
      firstName,
      lastName,
      email,
      password: hashPassword,
    };

    // Creating new instance of user model.
    const user = new User(userObj);

    res.send("User Added successfully");
    await user.save();
  } catch (error) {
    res.status(400).send(error + " Something went wrong");
  }
});

//user API get user by email

app.get("/user", async (req, res) => {
  try {
    const { email } = req.body;

    console.log(email);
    const user = await User.find({ email: email });
    if (!isEmpty(user)) {
      res.send(user);
    } else {
      res.status(404).send(`No User found for given email --> ${email}`);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Feed API to get all the user
app.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({});

    if (!isEmpty(users)) {
      res.send(users);
    } else {
      res.status(404).send("Collection is Empty");
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// login api
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if email is present
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(400).send("User not found");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("Login Successfull");
    } else {
      res.send("Wrong Password");
    }
  } catch (error) {
    res.send(`${error} :Something went Wrong...`);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      res.send(user);
    } else {
      throw new Error("No user found");
    }
  } catch (error) {
    res.send("Something went Wrong...");
  }
});

connectDB()
  .then((res) => {
    console.log("DB Connected");

    // We first make connect to DB then start our server
    startServer();
  })
  .catch((err) => {
    console.log(err, "Unable to connect DB");
  });
