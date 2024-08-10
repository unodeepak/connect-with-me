const Model = require("../../models");
const sCode = require("../../constant/statusCode");
const constant = require("../../constant/constant");
const generateOtp = require("../../utils/generateOtp");
const generatePassword = require("../../utils/generatePassword");

const getUserToken = (userType) => {
  let token;
  if (userType == "admin") {
    token = {
      accessToken: Model.User.getToken("author"),
      refreshToken: Model.User.getToken("author", "refreshToken"),
    };
  } else {
    token = {
      accessToken: Model.User.getToken(),
      refreshToken: Model.User.getToken("", "refreshToken"),
    };
  }

  return token;
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Model.User.findOne({ email });
    if (!user) {
      return res
        .status(sCode.NOT_FOUND)
        .json({ msg: constant.user.USER_NOT_FOUND, success: false });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: constant.INVALID_CREDENTIALS, success: false });
    }

    // Return JSON Web Token (JWT)
    const payload = { userId: user.id };
    const token = jwt.sign(payload, "your_jwt_secret", { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.signup = async (req, res) => {
  const body = req.body;

  try {
    let user = await Model.User.findOne({ email, isActive: true });
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
    return res.status(sCode.OK).json({ msg: constant.OTP_SENT, success: true });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    let user = await Model.Otp.findOne({ email, otp }).select(
      "firstName lastName email -_id"
    );
    if (!user) {
      return res.status(sCode.ALREADY_EXISTS).json({
        msg: constant.INVALID_OTP,
        success: false,
      });
    }

    user.password = generatePassword();
    const newUser = new Model.User(user);
    await newUser.save();

    return res.status(sCode.OK).json({ msg: constant.OTP_SENT, success: true });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.createPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Model.User.findOne({ email }).select(
      "email password firstName lastName"
    );
    if (!user) {
      return res.status(sCode.NOT_FOUND).json({
        msg: constant.user.INVALID_EMAIL,
        success: false,
      });
    }

    user.password = password;
    user = await user.save();

    const data = {
      user,
      token: getUserToken("user"),
    };

    return res
      .status(sCode.OK)
      .json({ data, msg: constant.user.PASS_CREATED, success: true });
  } catch (error) {
    console.error("Error during creating password:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const data = await Model.User.findById(req.user.userId).select("-password");
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
    const data = await Model.User.findByIdAndUpdate(userId, {
      $set: body,
    });

    if (!data) {
      return res
        .status(sCode.NOT_FOUND)
        .json({ msg: constant.NOT_FOUND, success: false });
    }
    return res.status(sCode.OK).json({ msg: constant.UPDATED_RECORD, success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
