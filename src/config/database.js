const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://mohitpandey825:c6Z0mMNAMc9XIiTA@namaste-node.4zwpf.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
