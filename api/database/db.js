const mongoose = require("mongoose");

const connect = () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    mongoose.connect(MONGO_URI, {});
  } catch(err) {
    console.log("mongoose is not connect: ", err);
  }
}