const Model = require("../../models");
const sCode = require("../../constant/statusCode");
const constant = require("../../constant/constant");
const generateOtp = require("../../utils/generateOtp");
const generatePassword = require("../../utils/generatePassword");

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

exports.create = async (req, res) => {
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
    let user = await Model.User.findOne({ email }).select("email password");
    if (!user) {
      return res.status(sCode.NOT_FOUND).json({
        msg: constant.user.INVALID_EMAIL,
        success: false,
      });
    }

    user.password = password;
    await user.save();

    return res
      .status(sCode.OK)
      .json({ msg: constant.user.PASS_CREATED, success: true });
  } catch (error) {
    console.error("Error during creating password:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
