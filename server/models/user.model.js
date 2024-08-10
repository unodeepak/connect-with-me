const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    linkedinUri: { type: String },
    fiverrUri: { type: String },
    upworkUri: { type: String },
    instaUri: { type: String },
    twitter: { type: String },
    gender: { type: String },
    dob: { type: Date },
    address: { type: String },
    pincode: { type: String },
    city: { type: String },
    state: { type: String },
    district: { type: String },
    country: { type: String },
    profilePictureUrl: { type: String },
    isActive: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    userType: {
      type: String,
      enum: ["user", "client", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const saltNumber = process.env.SALT;
    const salt = await bcrypt.genSalt(saltNumber);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.match = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("user", userSchema, "user");
