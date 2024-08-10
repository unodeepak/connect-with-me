const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // 600 seconds = 10 minutes
  },
});

module.exports = mongoose.model("otp", otpSchema, "otp");
