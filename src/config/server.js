const express = require("express");
const app = express();

const startServer = () => {
  app.listen(5000, () => {
    console.log("Listening to port 5000");
  });
};

module.exports = { app, startServer };
