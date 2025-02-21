const express = require("express");
const connectDB = require("./config/database");
const { app, startServer } = require("./config/server");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoutes");
const profileRouter = require("./routes/profileRoutes");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(cookieParser());


app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/user', userRouter)

connectDB()
  .then((res) => {
    console.log("DB Connected");

    // We first make connect to DB then start our server
    startServer();
  })
  .catch((err) => {
    console.log(err, "Unable to connect DB");
  });
