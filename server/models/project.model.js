const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
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
      enum: ["pending", "approved", "running", "completed", "cancelled"],
      default: "pending",
    },
    cancelReason: { type: String, default: "" },
    amount: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("project", projectSchema, "project");
