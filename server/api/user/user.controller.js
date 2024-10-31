const Model = require("../../models");
const sCode = require("../../constant/statusCode");
const constant = require("../../constant/constant");
const generateOtp = require("../../utils/generateOtp");
const generatePassword = require("../../utils/generatePassword");
const { sendEmail } = require("../../services/email/emailService");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getUserToken = (userType = "user", model) => {
  let token;
  if (userType == "admin") {
    token = {
      accessToken: model.getToken("author"),
      refreshToken: model.getToken("author", "refreshToken"),
    };
  } else {
    token = {
      accessToken: model.getToken(),
      refreshToken: model.getToken("", "refreshToken"),
    };
  }

  return token;
};

exports.refreshToken = async (req, res) => {
  try {
    const user = await Model.User.findById(req.user._id);
    let token;
    if (user.userType == "admin") {
      token = getUserToken("admin", user);
    } else {
      token = getUserToken("user", user);
    }

    return res
      .status(sCode.OK)
      .json({ data: token.accessToken, success: true });
  } catch (err) {
    return res
      .status(sCode.SERVER_ERROR)
      .json({ msg: "Something went wrong", success: false });
  }
};
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.toLowerCase();
    const user = await Model.User.findOne({ email }).select(
      "-bankDetails -isDelete -isActive"
    );
    if (!user) {
      return res
        .status(sCode.NOT_FOUND)
        .json({ msg: constant.user.USER_NOT_FOUND, success: false });
    }

    // Compare passwords
    const isMatch = await user.match(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: constant.INVALID_CREDENTIALS, success: false });
    }

    if (user.userType == "admin") {
      token = getUserToken("admin", user);
    } else {
      token = getUserToken("user", user);
    }

    return res
      .status(sCode.OK)
      .json({ data: { data: user, token }, success: true });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.signup = async (req, res) => {
  const body = req.body;

  try {
    body.email = body?.email?.toLowerCase();
    let user = await Model.User.findOne({ email: body.email, isActive: true });
    if (user) {
      return res.status(sCode.ALREADY_EXISTS).json({
        msg: constant.user.ALREADY_EXISTS,
        success: false,
      });
    }

    body.otp = generateOtp();
    user = await Model.Otp.findOne({ email: body.email });
    if (user) {
      await Model.Otp.findByIdAndUpdate(user._id, { $set: body });
    } else {
      await Model.Otp.create(body);
    }

    /* Write the code for sent otp */
    await sendEmail({
      email: body.email,
      subject: "Verification Email OTP",
      template: "otp_verify",
      otp: body.otp,
    });
    return res.status(sCode.OK).json({ msg: constant.OTP_SENT, success: true });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  let { email, otp } = req.body;
  email = email?.toLowerCase();
  try {
    let isExist = await Model.User.findOne({
      email,
      isActive: true,
      isDelete: { $ne: true },
    });

    if (isExist) {
      return res.status(sCode.ALREADY_EXISTS).json({
        msg: constant.user.ALREADY_EXISTS,
        success: false,
      });
    }

    let user = await Model.Otp.findOne({ email, otp })
      .select("firstName lastName email -_id")
      .lean();
    if (!user) {
      return res.status(sCode.BAD_REQUEST).json({
        msg: constant.INVALID_OTP,
        success: false,
      });
    }

    user.password = generatePassword();
    user.isActive = true;
    user.isVerifiedEmail = true;

    const newUser = new Model.User(user);
    const User = await newUser.save();

    /* Create user wallet */
    await Model.Wallet.create({ userId: User._id, amount: 0 });

    const data = {
      token: getUserToken("user", User),
    };

    return res
      .status(sCode.OK)
      .json({ data, msg: constant.INVALID_VERIFIED, success: true });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

/* This is used during password forgot */
exports.sendOtp = async (req, res) => {
  let { email, phoneNumber } = req.body;
  email = email ? email?.toLowerCase() : email;

  try {
    if (!(email || phoneNumber)) {
      return res
        .status(sCode.BAD_REQUEST)
        .json({ msg: "Email or Phone number is required", success: false });
    }

    let user = await Model.User.findOne({
      $or: [{ email }, { phoneNumber }],
      isDelete: { $ne: true },
    })
      .select("email password firstName lastName")
      .lean();

    if (!user) {
      return res.status(sCode.BAD_REQUEST).json({
        msg: `${constant.user.NOT_REGISTER} ${email ? "Email" : "PhoneNumber"}`,
        success: false,
      });
    }

    if (email) {
      delete user._id;
      user.otp = generateOtp();

      const isExist = await Model.Otp.findOne({ email });
      if (isExist) {
        await Model.Otp.findOneAndUpdate({ email }, { $set: user });
      } else {
        await Model.Otp.create(user);
      }

      /* Write the code for send otp */
    } else if (phoneNumber) {
      /* Write the code for send otp on Phone number */
    }

    return res.status(sCode.OK).json({ msg: constant.OTP_SENT, success: true });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.verifyOtpPassword = async (req, res) => {
  let { email, phoneNumber, otp } = req.body;
  email = email?.toLowerCase();

  try {
    if (!(email || phoneNumber)) {
      return res
        .status(sCode.BAD_REQUEST)
        .json({ msg: "Email or Phone number is required", success: false });
    }

    let user = await Model.User.findOne({
      $or: [{ email }, { phoneNumber }],
      isDelete: { $ne: true },
    })
      .select("-bankDetails")
      .lean();

    if (!user) {
      return res.status(sCode.BAD_REQUEST).json({
        msg: `${constant.user.NOT_REGISTER} ${email ? "Email" : "PhoneNumber"}`,
        success: false,
      });
    }

    if (email) {
      const isVerify = await Model.Otp.findOne({ email, otp });
      if (!isVerify) {
        return res
          .status(sCode.OK)
          .json({ msg: constant.INVALID_OTP, success: false });
      }

      console.log({ user });
      const data = {
        token: getUserToken("user", user),
        data: user,
      };
      return res
        .status(sCode.OK)
        .json({ data, msg: constant.INVALID_VERIFIED, success: true });
    } else if (phoneNumber) {
      /* Write the code for send otp on Phone number */
    }

    return res
      .status(sCode.OK)
      .json({ data, msg: constant.OTP_SENT, success: true });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.createPassword = async (req, res) => {
  const { password } = req.body;
  const userId = req.user._id;

  try {
    const user = await Model.User.findById(userId);
    user.password = password;
    await user.save();

    return res
      .status(sCode.OK)
      .json({ msg: constant.user.PASS_CREATED, success: true });
  } catch (error) {
    console.error("Error during creating password:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { password } = req.body;

  try {
    const user = await Model.User.findById(req.user._id);
    user.password = password;
    await Model.User.save();

    return res
      .status(sCode.OK)
      .json({ data, msg: constant.user.PASS_UPDATED, success: true });
  } catch (error) {
    console.error("Error during creating password:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    let user = await Model.User.findOne(req.user._id).select(
      "email password firstName lastName"
    );

    const match = user.match(oldPassword);
    if (!match) {
      return res
        .status(sCode.BAD_REQUEST)
        .json({ data, msg: constant.user.INVALID_OLD_PASS, success: false });
    }

    user.password = newPassword;
    await user.save();
    return res
      .status(sCode.OK)
      .json({ msg: constant.user.PASS_CREATED, success: true });
  } catch (error) {
    console.error("Error during creating password:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const data = await Model.User.findById(req.user._id).select("-password -isActive -userType");
    if (!data) {
      return res
        .status(sCode.NOT_FOUND)
        .json({ msg: constant.NOT_FOUND, success: false });
    }
    return res.status(sCode.OK).json({ data, success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await Model.User.findById(userId).select("-password");
    if (!data) {
      return res
        .status(sCode.NOT_FOUND)
        .json({ msg: constant.NOT_FOUND, success: false });
    }
    return res.status(sCode.OK).json({ data, success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const userId = req.user._id;
    const body = req.body;
    let { email, phoneNumber, bankDetails } = body;
    const query = {
      $or: [],
    };

    if (email) {
      email = email.toLowerCase();
      query.$or.push({ email });
    }
    if (phoneNumber) {
      query.$or.push({ phoneNumber });
    }
    if (bankDetails && bankDetails?.accountNumber) {
      query.$or.push({
        "bankDetails.accountNumber": bankDetails?.accountNumber,
      });
    }

    if (query.$or?.length) {
      query._id = { $ne: userId };

      const isExist = await Model.User.findOne(query);
      if (isExist) {
        let msg =
          email == isExist?.email
            ? "Email"
            : phoneNumber == isExist?.phoneNumber
            ? "PhoneNumber"
            : "AccountNumber";
        msg = `${msg} is exist`;

        return res.status(sCode.BAD_REQUEST).json({ msg, success: false });
      }
    }

    const data = await Model.User.findByIdAndUpdate(userId, {
      $set: body,
    });

    return res
      .status(sCode.OK)
      .json({ data, msg: constant.UPDATED_RECORD, success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const allStatusData = await Model.Project.aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);
    const data = { runningCount: 0, completeCount: 0, pendingCount: 0 };
    allStatusData.forEach((ele) => {
      if (ele?.status == "running") {
        data.runningCount = ele.count;
      } else if (ele?.status == "pending") {
        data.pendingCount = ele.count;
      } else if (ele?.status == "completed") {
        data.completeCount = ele.count;
      }
    });
    let wallet = await Model.Wallet.findOne({ userId });
    data.amount = wallet?.amount || 0;

    return res.status(sCode.OK).json({ data, success: true });
  } catch (error) {
    console.log("Error is : ", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
