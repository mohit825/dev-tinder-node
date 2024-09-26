const express = require("express");
const connectDB = require("./config/database");
const { app, startServer } = require("./config/server");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Mohit",
    lastName: "Pandey",
    email: "mohit@gmail.com",
  };

  // Creating new instance of user model.
  const user = new User(userObj);

  try {
    res.send("User Added successfully");
    await user.save();
  } catch (error) {
    res.status(400).send("Unbale to add user");
  }
});

connectDB()
  .then((res) => {
    console.log("DB Connected");

    // We first make connect to DB then start our server
    startServer();
  })
  .catch((err) => {
    console.log("Unable to connect DB");
  });
