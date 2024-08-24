const constant = require("../../constant/constant");
const sCode = require("../../constant/statusCode");
const Model = require("../../models");

exports.addMoneyToUserWallet = async (req, res) => {
  try {
    const body = req.body;
    body.status = "credited";
    body.creditedBy = req.user._id;

    await Model.Transaction.create(req.body);
    let user = await Model.Wallet.findOne({ userId: body.userId });
    if (!user) {
      user = await Model.Wallet.create({ userId: body.userId, amount: 0 });
    }
    user.amount = body.amount;
    await Model.Wallet.findByIdAndUpdate(user._id, {
      $inc: { amount: body.amount },
    });

    return res
      .status(sCode.OK)
      .json({ msg: constant.transaction.ADDED, success: true });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getBalanceByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    let data = await Model.Wallet.findOne({ userId });

    return res
      .status(sCode.OK)
      .json({ data, msg: constant.FOUND, success: true });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    let data = await Model.Transaction.findOne({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res
      .status(sCode.OK)
      .json({ data, msg: constant.FOUND, success: true });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};
