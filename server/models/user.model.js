const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    isVerifiedEmail: { type: Boolean, default: false },
    isVerifiedPhone: { type: Boolean, default: false },
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
    bankDetails: {
      accountHolderName: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      accountNumber: {
        type: String,
        trim: true,
        minlength: 10,
        maxlength: 20,
      },
      bankName: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      branchName: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      ifscCode: {
        type: String,
        trim: true,
        uppercase: true,
        minlength: 11,
        maxlength: 11,
        validate: {
          validator: function (v) {
            return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v);
          },
          message: (props) => `${props.value} is not a valid IFSC code!`,
        },
      },
      accountType: {
        type: String,
        required: true,
        enum: ["Savings", "Current", "Salary", "Fixed Deposit"],
        default: "Savings",
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const saltNumber = +process.env.SALT;
    console.log({saltNumber1: saltNumber});
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

userSchema.methods.getToken = function (
  userType = "user",
  tokenType = "accessToken"
) {
  const jwtSecret = process.env.jwtSecret;
  const jwtUserExpire = process.env.jwtUserExpire;
  const jwtRefreshSecret = process.env.jwtRefreshSecret;
  const jwtUserRefreshExpire = process.env.jwtUserRefreshExpire;
  const jwtAdminExpire = process.env.jwtAdminExpire;
  const jwtAdminRefreshExpire = process.env.jwtAdminRefreshExpire;

  if (["user", "client"].includes(userType)) {
    if (tokenType == "accessToken") {
      return jwt.sign({ id: this.id }, jwtSecret, {
        expiresIn: jwtUserExpire,
      });
    } else {
      return jwt.sign({ id: this.id }, jwtRefreshSecret, {
        expiresIn: jwtUserRefreshExpire,
      });
    }
  } else {
    if (tokenType == "accessToken") {
      return jwt.sign({ id: this.id }, jwtSecret, {
        expiresIn: jwtAdminExpire,
      });
    } else {
      return jwt.sign({ id: this.id }, jwtRefreshSecret, {
        expiresIn: jwtAdminRefreshExpire,
      });
    }
  }
};

module.exports = mongoose.model("user", userSchema, "user");
