const express = require("express");
const { isEmpty } = require("lodash");
const connectDB = require("./config/database");
const { app, startServer } = require("./config/server");
const User = require("./models/user");
const validateSignUpData = require("./utils/validation");
const cookieParser = require("cookie-parser");
const userAuth = require("./middleware/auth");
const authRouter = require("./routes/authRoutes");
const profileRouter = require("./routes/profileRoutes");

app.use(express.json());
app.use(cookieParser());


app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', authRouter)

connectDB()
  .then((res) => {
    console.log("DB Connected");

    // We first make connect to DB then start our server
    startServer();
  })
  .catch((err) => {
    console.log(err, "Unable to connect DB");
  });
