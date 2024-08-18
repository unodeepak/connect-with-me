const constant = require("../../constant/constant");
const sCode = require("../../constant/statusCode");
const Model = require("../../models");

exports.addMoneyToUserWallet = async (req, res) => {
  try {
    req.body.userId = req.user._id;
    await Model.Project.create(req.body);
    return res
      .status(sCode.CREATED)
      .json({ msg: constant.project.ADDED, success: true });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};
