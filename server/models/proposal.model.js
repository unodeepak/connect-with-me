const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProposalSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    client: {
      name: { type: String },
      email: { type: String, required: true },
      phone: { type: String },
      gender: { type: String, enum: ["male", "female", "other"] },
    },
    projectName: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "running", "complete", "cancelled"],
      default: "pending",
    },
    cancelReason: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("proposal", ProposalSchema, "proposal");
