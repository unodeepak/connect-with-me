const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: true,
      default: "pending",
    },
    ssUri: { type: String }, // screenshot uri
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "paymentHistory",
  paymentHistorySchema,
  "paymentHistory"
);
