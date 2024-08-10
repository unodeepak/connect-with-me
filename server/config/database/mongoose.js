const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    await mongoose.connect(MONGO_URI, {});
    console.log("MongoDB is connected successfully");
  } catch (err) {
    console.log("mongoose is not connect: ", err);
  }
};

module.exports = connectDB;
