const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      // required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      required: true,
      default: "pending",
    },
    transactionType: {
      type: String,
      enum: ["credited", "debited"],
      default: "credited",
    },
    ssUri: { type: String }, // screenshot uri
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "transaction",
  TransactionSchema,
  "transaction"
);
